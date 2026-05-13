export function formatarPrioridade(prioridade: string): string {
    const mapa: Record<string, string> = {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta',
    };

    return mapa[prioridade] ?? 'Desconhecida';
}

export function estaAtrasada(
    tarefa: { dataVencimento: Date | null; concluida: boolean },
    agora: Date = new Date(),
): boolean {
    if (!tarefa.dataVencimento || tarefa.concluida) return false;

    return tarefa.dataVencimento < agora;
}

export function diasParaVencimento(dataVencimento: Date | null, agora: Date = new Date()): number | null {
    if (!dataVencimento) return null;

    const diffMs = dataVencimento.getTime() - agora.getTime();

    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function calcularEstatisticas(
    tarefas: Array<{ concluida: boolean; prioridade?: string | null }>,
): {
    total: number;
    concluidas: number;
    pendentes: number;
    porPrioridade: Record<string, number>;
} {
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.concluida).length;
    const pendentes = total - concluidas;
    const porPrioridade: Record<string, number> = {};

    for (const t of tarefas) {
        const p = t.prioridade ?? 'sem_prioridade';
        porPrioridade[p] = (porPrioridade[p] ?? 0) + 1;
    }

    return { total, concluidas, pendentes, porPrioridade };
}
