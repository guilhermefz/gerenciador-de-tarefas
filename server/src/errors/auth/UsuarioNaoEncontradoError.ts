export class UsuarioNaoEncontradoError extends Error {
    constructor(message?: string) {
        super(message ?? 'Usuário não encontrado');
        this.name = 'UsuarioNaoEncontradoError';
    }
}
