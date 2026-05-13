export class NomeTarefaInvalidoError extends Error {
    constructor(message?: string) {
        super(message ?? 'O nome da tarefa não pode começar com número');
        this.name = 'NomeTarefaInvalidoError';
    }
}
