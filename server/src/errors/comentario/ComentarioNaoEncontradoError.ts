export class ComentarioNaoEncontradoError extends Error {
    constructor(message?: string) {
        super(message ?? 'Comentário não encontrado');
        this.name = 'ComentarioNaoEncontradoError';
    }
}
