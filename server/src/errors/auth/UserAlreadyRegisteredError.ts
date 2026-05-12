export class UserAlreadyRegisteredError extends Error {
    constructor(message?: string) {
        super(message ?? 'Usuário já cadastrado');
        this.name = 'UserAlreadyRegisteredError';
    }
}
