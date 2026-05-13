export class UsuarioJaCadastradoError extends Error {
    constructor(message?: string) {
        super(message ?? 'Usuário já cadastrado');
        this.name = 'UsuarioJaCadastradoError';
    }
}
