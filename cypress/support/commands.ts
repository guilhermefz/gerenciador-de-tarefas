/* eslint-disable @typescript-eslint/no-namespace */

Cypress.Commands.add('registerUser', (user) => {
    cy.request('POST', `${Cypress.env('apiUrl')}/autenticacao/registrar`, user);
});

Cypress.Commands.add('resetDatabase', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/teste/resetar-banco`);
});

Cypress.Commands.add('login', (email: string, senha: string) => {
    cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/autenticacao/entrar`,
        body: { email, senha },
    }).then(({ body }) => {
        expect(body).to.have.property('token');
        window.localStorage.setItem('token', body.token);
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            resetDatabase(): Chainable<void>;
            registerUser(user: { nome: string; email: string; senha: string }): Chainable<void>;
            login(email: string, senha: string): Chainable<void>;
        }
    }
}

export {};
