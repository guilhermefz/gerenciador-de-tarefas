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

    it('deve editar o título de uma tarefa', () => {
        // cria a tarefa
        cy.visit('/tasks/create');
        cy.get('[data-testid="title-input"]').type('Título original');
        cy.get('[data-testid="submit-button"]').click();

        // acessa os detalhes clicando nela na lista
        cy.contains('Título original').click();

        // clica em editar
        cy.get('[data-testid="edit-button"]').click();

        // altera o título e salva
        cy.get('[data-testid="title-input"]').clear().type('Título editado');
        cy.get('[data-testid="submit-button"]').click();

        // verifica o novo título na lista
        cy.get('[data-testid="task-list"]')
            .should('contain', 'Título editado')
            .and('not.contain', 'Título original');
    });

    it('deve marcar uma tarefa como concluída', () => {
        // cria a tarefa
        cy.visit('/tasks/create');
        cy.get('[data-testid="title-input"]').type('Tarefa para concluir');
        cy.get('[data-testid="submit-button"]').click();

        // acessa os detalhes e abre a edição
        cy.contains('Tarefa para concluir').click();
        cy.get('[data-testid="edit-button"]').click();

        // marca como concluída e salva
        cy.get('[data-testid="completed-checkbox"]').check();
        cy.get('[data-testid="submit-button"]').click();

        // acessa os detalhes novamente e verifica o status
        cy.contains('Tarefa para concluir').click();
        cy.get('[data-testid="task-status"]').should('contain', 'Concluída');
    });

    it('deve excluir uma tarefa', () => {
        // cria a tarefa
        cy.visit('/tasks/create');
        cy.get('[data-testid="title-input"]').type('Tarefa para excluir');
        cy.get('[data-testid="submit-button"]').click();

        // acessa os detalhes e exclui
        cy.contains('Tarefa para excluir').click();
        cy.get('[data-testid="delete-button"]').click();

        // verifica que sumiu da lista
        cy.url().should('include', '/tasks');
        cy.get('[data-testid="task-list"]').should('not.contain', 'Tarefa para excluir');
    });
});