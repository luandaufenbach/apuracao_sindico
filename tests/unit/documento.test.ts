import { describe, expect, it } from "vitest";

import {
  cnpjValido,
  cpfValido,
  digitosCnpj,
  digitosCpf,
  normalizarDocumento,
  prefixoDocumento,
  validarDocumento,
} from "@/lib/documento";

describe("documento", () => {
  it("normaliza tirando pontuação e espaços (R3)", () => {
    expect(normalizarDocumento("123.456.789-09")).toBe("12345678909");
    expect(normalizarDocumento(" 12.abc.345/01de-35 ")).toBe("12ABC34501DE35");
  });

  it("valida o dígito verificador do CPF", () => {
    expect(cpfValido("52998224725")).toBe(true);
    expect(cpfValido("11144477735")).toBe(true);
    expect(cpfValido("52998224726")).toBe(false);
    expect(cpfValido("11111111111")).toBe(false);
    expect(cpfValido("5299822472")).toBe(false);
    expect(digitosCpf("123456789")).toBe("09");
  });

  it("valida o CNPJ numérico e o alfanumérico (ASCII menos 48)", () => {
    expect(cnpjValido("11222333000181")).toBe(true);
    expect(cnpjValido("11222333000182")).toBe(false);
    expect(cnpjValido("12ABC34501DE35")).toBe(true);
    expect(cnpjValido("12ABC34501DE36")).toBe(false);
    expect(cnpjValido("00000000000000")).toBe(false);
    // Os dígitos verificadores são sempre numéricos.
    expect(cnpjValido("12ABC34501DE3A")).toBe(false);
    expect(digitosCnpj("12ABC34501DE")).toBe("35");
  });

  it("validarDocumento devolve o tipo e null para documento inválido (R4)", () => {
    expect(validarDocumento("529.982.247-25")).toEqual({
      documento: "52998224725",
      tipo: "cpf",
    });
    expect(validarDocumento("12.abc.345/01de-35")).toEqual({
      documento: "12ABC34501DE35",
      tipo: "cnpj",
    });
    expect(validarDocumento("529.982.247-2")).toBeNull();
    expect(validarDocumento("529.982.247-255")).toBeNull();
    expect(validarDocumento("")).toBeNull();
    expect(validarDocumento("ABC.DEF.GHI-JK")).toBeNull();
  });

  it("prefixo tem só os 3 primeiros caracteres (R10)", () => {
    expect(prefixoDocumento("126.456.789-00")).toBe("126");
    expect(prefixoDocumento("12.ABC.345/01DE-35")).toBe("12A");
  });
});
