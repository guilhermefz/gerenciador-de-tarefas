export class CredenciaisInvalidasError extends Error {
    constructor(message?: string) {
        super(message ?? 'Credenciais inválidas');
        this.name = 'CredenciaisInvalidasError';
    }
}
