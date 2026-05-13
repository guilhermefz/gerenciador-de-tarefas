export class TarefaNaoEncontradaError extends Error {
    constructor(message?: string) {
        super(message ?? 'Tarefa não encontrada');
        this.name = 'TarefaNaoEncontradaError';
    }
}
