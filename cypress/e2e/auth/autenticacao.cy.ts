describe('Autenticação', () => {
    it('deve exibir o formulário de login', () => {
        cy.visit('/login');

        cy.get('[data-testid="email-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');
        cy.get('[data-testid="login-button"]').should('be.visible');
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
    
    it('deve mostrar erro ao tentar login com e-mail não cadastrado', () => {
        cy.visit('/login');
        cy.get('[data-testid="email-input"]').type('inexistente@teste.com');
        cy.get('[data-testid="password-input"]').type('Senha123');
        cy.get('[data-testid="login-button"]').click();
        
        cy.get('[data-testid="error-message"]').should('be.visible');
    });
    
    it('deve registrar com dados válidos', () => {
        cy.visit('/register'); // ← rota da página de cadastro
        
        cy.get('[data-testid="name-input"]').type('Maria Teste');
        cy.get('[data-testid="email-input"]').type('maria@teste.com');
        cy.get('[data-testid="password-input"]').type('Senha123');
        cy.get('[data-testid="register-button"]').click();
        
        cy.get('[data-testid="success-message"]').should('be.visible'); // ← asserção de visibilidade
    });
    
    it('deve mostrar erro com senha incorreta', () => {
        cy.registerUser({ nome: 'Usuário Teste', email: 'usuario@teste.com', senha: 'Senha123' });
        
        cy.visit('/login');
        cy.get('[data-testid="email-input"]').type('usuario@teste.com');
        cy.get('[data-testid="password-input"]').type('SenhaErrada');
        cy.get('[data-testid="login-button"]').click();
        
        cy.get('[data-testid="error-message"]').should('be.visible'); // ← data-testid da mensagem de erro (veja pages/Login/index.tsx)
    });
    
    it('deve redirecionar para /login ao acessar /tasks sem autenticação', () => {
        cy.visit('/tasks');
        
        cy.url().should('include', '/login');
    });

    it('deve mostrar erro ao registrar com e-mail já cadastrado', () => {
        // cadastra o usuário via API
        cy.registerUser({ nome: 'Usuário Original', email: 'duplicado@teste.com', senha: 'Senha123' });

        // tenta registrar o mesmo e-mail pela interface
        cy.visit('/register');
        cy.get('[data-testid="name-input"]').type('Usuário Duplicado');
        cy.get('[data-testid="email-input"]').type('duplicado@teste.com');
        cy.get('[data-testid="password-input"]').type('Senha123');
        cy.get('[data-testid="register-button"]').click();

        // verifica a mensagem de erro
        cy.get('[data-testid="error-message"]').should('be.visible');
    });
});