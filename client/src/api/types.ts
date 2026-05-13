export interface Tarefa {
    id: number;
    titulo: string;
    descricao?: string;
    concluida: boolean;
    dataVencimento?: string;
    prioridade?: 'low' | 'medium' | 'high';
    usuarioId: number;
    criadaEm: string;
    atualizadaEm: string;
}

export interface Usuario {
    id: number;
    email: string;
    nome: string;
    criadoEm?: string;
}

export interface RespostaAutenticacao {
    token: string;
    usuario: {
        id: number;
        email: string;
        nome: string;
    };
}
