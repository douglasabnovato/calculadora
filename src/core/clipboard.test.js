/*
 * clipboard.test.js · cópia com sucesso, sem Clipboard API e com permissão negada.
 */
import { copyText, COPY_OK, COPY_UNAVAILABLE, COPY_DENIED } from "./clipboard";

describe("copyText", () => {
  test("copia o texto e devolve a mensagem de sucesso", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    await expect(copyText("3,5", { writeText })).resolves.toEqual({ ok: true, message: COPY_OK });
    expect(writeText).toHaveBeenCalledWith("3,5");
  });

  test("sem Clipboard API, devolve erro claro em vez de lançar", async () => {
    await expect(copyText("3,5", undefined)).resolves.toEqual({ ok: false, message: COPY_UNAVAILABLE });
    await expect(copyText("3,5", {})).resolves.toEqual({ ok: false, message: COPY_UNAVAILABLE });
  });

  test("com a permissão negada, devolve erro claro", async () => {
    const writeText = jest.fn().mockRejectedValue(new Error("NotAllowedError"));
    await expect(copyText("3,5", { writeText })).resolves.toEqual({ ok: false, message: COPY_DENIED });
  });
});
/* fim de clipboard.test.js */
