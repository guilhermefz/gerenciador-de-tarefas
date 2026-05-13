export class EmailInvalidoError extends Error {
    constructor(message?: string) {
        super(message ?? 'E-mail inválido');
        this.name = 'EmailInvalidoError';
    }
}
