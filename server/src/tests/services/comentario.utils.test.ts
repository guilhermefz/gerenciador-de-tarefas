import { validarTextoComentario } from '../../utils/comentario.utils';

describe('validarTextoComentario', () => {
  it('deve aceitar um comentário com texto válido', () => {
    const texto = 'Ótimo progresso nesta tarefa!';
    const resultado = validarTextoComentario(texto);

    expect(resultado.valido).toBe(true);
    expect(resultado.mensagem).toBeUndefined();
  });

  it('deve rejeitar um comentário vazio ou só com espaços', () => {
    const texto = '   ';
    const resultado = validarTextoComentario(texto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensagem).toBe('O comentário não pode estar vazio');
  });

  it('deve rejeitar um comentário com mais de 500 caracteres', () => {
    const texto = 'a'.repeat(501);
    const resultado = validarTextoComentario(texto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensagem).toBe('O comentário não pode ter mais de 500 caracteres');
  });
});