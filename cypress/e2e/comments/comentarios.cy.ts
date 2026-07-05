describe('Comentários em Tarefas', () => {
    beforeEach(() => {
        cy.registerUser({ nome: 'Usuário Teste', email: 'usuario@teste.com', senha: 'Senha123' });
        cy.login('usuario@teste.com', 'Senha123');
    });

    it('deve adicionar um comentário em uma tarefa e exibi-lo na tela', () => {
        cy.visit('/tasks/create');// cria a tarefa que vai receber o comentário
        cy.get('[data-testid="title-input"]').type('Tarefa para comentar');
        cy.get('[data-testid="submit-button"]').click();

        cy.contains('Tarefa para comentar').click();// abre os detalhes da tarefa

        cy.get('[data-testid="comment-empty"]').should('be.visible');// a seção de comentários começa vazia
        cy.get('[data-testid="comment-count"]').should('contain', '0');

        cy.get('[data-testid="comment-input"]').type('Primeiro comentário via Cypress!');// escreve e envia o comentário
        cy.get('[data-testid="comment-submit"]').click();

        cy.get('[data-testid="comment-item"]').should('contain', 'Primeiro comentário via Cypress!');// o comentário aparece na lista e o contador atualiza
        cy.get('[data-testid="comment-count"]').should('contain', '1');
        cy.get('[data-testid="comment-empty"]').should('not.exist');
    });
});