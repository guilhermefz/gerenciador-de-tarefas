describe('Autenticação', () => {
    it('deve exibir o formulário de login', () => {
        cy.visit('/login');

        cy.get('[data-testid="email-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');
        cy.get('[data-testid="login-button"]').should('be.visible');
    });
});

it('deve exibir o formulário de cadastro', () => {
        cy.visit('/register'); // ← qual é a rota? (veja client/src/App.tsx)

        cy.get('[data-testid="name-input"]').should('be.visible');
        cy.get('[data-testid="email-input"]').should('be.visible');
        cy.get('[data-testid="register-button"]').should('be.visible'); // ← data-testid do botão (veja pages/Register/index.tsx)
    });

 it('não deve exibir mensagem de erro antes de qualquer interação', () => {
        cy.visit('/login');

        cy.get('[data-testid="error-message"]').should('not.exist');
    });

it('deve fazer login com credenciais válidas', () => {
        cy.registerUser({ nome: 'Usuário Teste', email: 'usuario@teste.com', senha: 'Senha123' });

        cy.visit('/login');
        cy.get('[data-testid="email-input"]').type('usuario@teste.com');
        cy.get('[data-testid="password-input"]').type('Senha123');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('include', '/tasks');
        cy.get('[data-testid="task-list"]').should('exist');
    });