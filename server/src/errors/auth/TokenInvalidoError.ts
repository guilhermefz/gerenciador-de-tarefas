export class TokenInvalidoError extends Error {
    constructor(message?: string) {
        super(message ?? 'Token inválido');
        this.name = 'TokenInvalidoError';
    }
}
