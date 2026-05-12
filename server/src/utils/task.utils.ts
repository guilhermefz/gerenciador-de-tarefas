export function formatarPrioridade(prioridade: string): string {
    const mapa: Record<string, string> = {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta',
    };

    return mapa[prioridade] ?? 'Desconhecida';
}

export function estaAtrasada(
    tarefa: { dueDate: Date | null; completed: boolean },
    agora: Date = new Date(),
): boolean {
    if (!tarefa.dueDate || tarefa.completed) return false;

    return tarefa.dueDate < agora;
}

export function diasParaVencimento(dueDate: Date | null, agora: Date = new Date()): number | null {
    if (!dueDate) return null;

    const diffMs = dueDate.getTime() - agora.getTime();

    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function calcularEstatisticas(
    tarefas: Array<{ completed: boolean; priority?: string | null }>,
): {
    total: number;
    concluidas: number;
    pendentes: number;
    porPrioridade: Record<string, number>;
} {
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.completed).length;
    const pendentes = total - concluidas;
    const porPrioridade: Record<string, number> = {};

    for (const t of tarefas) {
        const p = t.priority ?? 'sem_prioridade';
        porPrioridade[p] = (porPrioridade[p] ?? 0) + 1;
    }

    return { total, concluidas, pendentes, porPrioridade };
}
