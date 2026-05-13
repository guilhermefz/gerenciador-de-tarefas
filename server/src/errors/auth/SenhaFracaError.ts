export class SenhaFracaError extends Error {
    constructor(message?: string) {
        super(message ?? 'Senha não atende aos requisitos mínimos');
        this.name = 'SenhaFracaError';
    }
}
