export class InvalidTokenError extends Error {
    constructor(message?: string) {
        super(message ?? 'Token inválido');
        this.name = 'InvalidTokenError';
    }
}
