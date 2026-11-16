/*
 * fluxo.e2e.js · fluxo principal no navegador, com axe e teclado.
 * O app tem dois temas de verdade (classes "vivo" e "dark" em index.css): o inicial segue
 * prefers-color-scheme (lido por matchMedia no App.jsx), e o botão do cabeçalho troca.
 * O axe roda nos dois temas e no estado de erro, em largura de desktop (1280 px).
 */
const { test, expect } = require("@playwright/test");
const { AxeBuilder } = require("@axe-core/playwright");

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/* Roda o axe na página inteira e lista as violações na mensagem de erro. */
async function expectNoAxeViolations(page) {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

/* Clica nas teclas pelos nomes acessíveis. */
async function press(page, names) {
  for (const name of names) {
    await page.getByRole("button", { name, exact: true }).click();
  }
}

const visor = (page) => page.locator("output.display-value");
const status = (page) => page.locator(".display-status");
const app = (page) => page.locator(".app-container");

test.beforeEach(async ({ context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
});

test("tema claro: conta pelo mouse, copia o resultado e passa no axe", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(app(page)).toHaveClass(/\bvivo\b/);
  await expectNoAxeViolations(page);

  await press(page, ["1", "2", "Multiplicar", "3", "Somar"]);
  await expect(page.locator(".display-expression")).toHaveText("36 +");
  await press(page, ["4", "Igual"]);
  await expect(visor(page)).toHaveText("40");

  await page.getByRole("button", { name: "Copiar resultado" }).click();
  await expect(status(page)).toHaveText("Resultado copiado");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("40");
  await expectNoAxeViolations(page);
});

test("tema escuro: segue o sistema, troca pelo botão, fica salvo e passa no axe", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(app(page)).toHaveClass(/\bdark\b/);
  await press(page, ["7", "Vírgula decimal", "5", "Dividir", "3", "Igual"]);
  await expect(visor(page)).toHaveText("2,5");
  await expectNoAxeViolations(page);

  await page.getByRole("button", { name: "Modo Vivo" }).click();
  await expect(app(page)).toHaveClass(/\bvivo\b/);
  await page.reload();
  await expect(app(page)).toHaveClass(/\bvivo\b/);
});

test("teclado: Tab com foco visível, conta, Ctrl+C e Esc", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" });

  /* Foco visível medido em cada elemento focado por Tab (sem chamar focus() por script). */
  const alvos = [
    page.getByRole("button", { name: "Modo Dark" }),
    page.getByRole("button", { name: "Copiar resultado" }),
    page.getByRole("button", { name: "AC, limpar tudo" }),
  ];
  for (const alvo of alvos) {
    await page.keyboard.press("Tab");
    await expect(alvo).toBeFocused();
    const outline = await alvo.evaluate((el) => {
      const style = getComputedStyle(el);
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
    });
    expect(outline.style).not.toBe("none");
    expect(outline.width).toBeGreaterThanOrEqual(2);
  }

  /* Tira o foco das teclas: Enter num botão focado é do próprio botão. */
  await page.evaluate(() => document.activeElement.blur());
  for (const key of ["7", "/", "2", "Enter"]) await page.keyboard.press(key);
  await expect(visor(page)).toHaveText("3,5");

  await page.keyboard.press("Control+c");
  await expect(status(page)).toHaveText("Resultado copiado");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("3,5");

  await page.keyboard.press("Escape");
  await expect(visor(page)).toHaveText("0");
  await expect(status(page)).toBeEmpty();
});

test("erro: divisão por zero anuncia o alerta e passa no axe nos dois temas", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  for (const key of ["8", "/", "0", "Enter"]) await page.keyboard.press(key);
  await expect(page.getByRole("alert")).toHaveText("Não é possível dividir por zero");
  await expect(page.getByRole("button", { name: "Copiar resultado" })).toHaveCount(0);
  await expectNoAxeViolations(page);

  await page.getByRole("button", { name: "Modo Dark" }).click();
  await expect(app(page)).toHaveClass(/\bdark\b/);
  await expectNoAxeViolations(page);

  await page.keyboard.press("5");
  await expect(visor(page)).toHaveText("5");
});

test("sem Clipboard API: erro claro e a calculadora segue funcionando", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "clipboard", { get: () => undefined, configurable: true });
  });
  await page.goto("/");
  await press(page, ["9"]);
  await page.getByRole("button", { name: "Copiar resultado" }).click();
  await expect(status(page)).toContainText("Não foi possível copiar");
  await press(page, ["Somar", "1", "Igual"]);
  await expect(visor(page)).toHaveText("10");
});
