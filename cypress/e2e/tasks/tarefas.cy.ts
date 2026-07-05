describe('Gerenciamento de Tarefas', () => {
    beforeEach(() => {
        cy.registerUser({ nome: 'Usuário Teste', email: 'usuario@teste.com', senha: 'Senha123' });
        cy.login('usuario@teste.com', 'Senha123');
    });

    it('deve exibir lista vazia quando não há tarefas', () => {
        cy.visit('/tasks');
        cy.get('[data-testid="empty-state"]').should('be.visible');
    });

    it('deve criar uma tarefa com dados válidos', () => {
        cy.visit('/tasks/create');
        cy.get('[data-testid="title-input"]').type('Estudar Cypress');
        cy.get('[data-testid="priority-select"]').select('high');
        cy.get('[data-testid="submit-button"]').click();

        cy.url().should('include', '/tasks');
        cy.url().should('not.include', '/create');
        cy.get('[data-testid="task-list"]').should('contain', 'Estudar Cypress');
    });
    
    it('deve criar uma tarefa com prioridade baixa', () => {
        cy.visit('/tasks/create');
        cy.get('[data-testid="title-input"]').type('Tarefa de baixa prioridade');
        cy.get('[data-testid="priority-select"]').select('low'); // ← qual é o valor interno para "Baixa"?
        cy.get('[data-testid="submit-button"]').click();
        
        cy.get('[data-testid="task-list"]').should('contain', 'Tarefa de baixa prioridade');
    });
    
    it('deve exibir os detalhes de uma tarefa criada', () => {
        cy.visit('/tasks/create');
        cy.get('[data-testid="title-input"]').type('Verificar detalhes');
        cy.get('[data-testid="submit-button"]').click();
        
        // clica no título da tarefa na lista
        cy.contains('Verificar detalhes').click();
        
        cy.get('[data-testid="task-title"]').should('contain', 'Verificar detalhes'); // ← data-testid do título na página de detalhes
        cy.get('[data-testid="task-status"]').should('contain', 'Pendente'); // ← qual texto aparece para uma tarefa recém-criada?
    });

    it('deve exibir duas tarefas criadas na lista', () => {
        // cria a primeira tarefa
        cy.visit('/tasks/create');
        cy.get('[data-testid="title-input"]').type('Primeira tarefa');
        cy.get('[data-testid="submit-button"]').click();
        cy.url().should('not.include', '/create');

        // cria a segunda tarefa
        cy.visit('/tasks/create');
        cy.get('[data-testid="title-input"]').type('Segunda tarefa');
        cy.get('[data-testid="submit-button"]').click();
        cy.url().should('not.include', '/create');

        // verifica que as duas aparecem na lista
        cy.get('[data-testid="task-list"]')
            .should('contain', 'Primeira tarefa')
            .and('contain', 'Segunda tarefa');
    });
});