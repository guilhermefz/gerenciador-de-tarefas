export class TextoComentarioInvalidoError extends Error {
    constructor(message?: string) {
        super(message ?? 'Texto do comentário inválido');
        this.name = 'TextoComentarioInvalidoError';
    }
}
