import { validarForcaSenha } from '../../utils/autenticacao.utils';

describe('validarForcaSenha', () => {
  it('deve aceitar senha válida com 6+ caracteres, letras e números', () => {
    const resultado = validarForcaSenha('abc123');

    expect(resultado.valida).toBe(true);
    expect(resultado.razao).toBeUndefined();
  });

  it('deve rejeitar senha com menos de 6 caracteres', () => {
    const resultado = validarForcaSenha('a1b2c');

    expect(resultado.valida).toBe(false);
    expect(resultado.razao).toBe('Senha deve ter no mínimo 6 caracteres');
  });

  it('deve rejeitar senha só com letras (sem número)', () => {
    const resultado = validarForcaSenha('abcdef');

    expect(resultado.valida).toBe(false);
    expect(resultado.razao).toBe('Senha deve conter pelo menos um número');
  });

  it('deve rejeitar senha só com números (sem letra)', () => {
    const resultado = validarForcaSenha('123456');

    expect(resultado.valida).toBe(false);
    expect(resultado.razao).toBe('Senha deve conter pelo menos uma letra');
  });
});
