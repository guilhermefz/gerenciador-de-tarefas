export const obterRotuloPrioridade = (prioridade?: string) => {
    switch (prioridade) {
        case 'low':
            return 'Baixa';
        case 'medium':
            return 'Média';
        case 'high':
            return 'Alta';
        default:
            return 'Desconhecida';
    }
};

export const obterCorPrioridade = (prioridade?: string) => {
    switch (prioridade) {
        case 'low':
            return 'text-green-400';
        case 'medium':
            return 'text-yellow-400';
        case 'high':
            return 'text-red-400';
        default:
            return 'text-slate-400';
    }
};
