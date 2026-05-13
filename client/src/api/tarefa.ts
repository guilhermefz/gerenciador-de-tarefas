import axios from 'axios';
import { Tarefa } from './types';

const API_URL = import.meta.env.VITE_API_URL;

const cabecalhoAuth = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const criar = async (
    tarefa: Omit<Tarefa, 'id' | 'criadaEm' | 'atualizadaEm' | 'concluida' | 'usuarioId'>,
    token: string,
): Promise<Tarefa> => {
    try {
        const response = await axios.post(`${API_URL}/tarefas`, tarefa, cabecalhoAuth(token));

        return response.data;
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        throw error;
    }
};

export const buscar = async (
    token: string,
    filtros?: { concluida?: boolean; prioridade?: string },
): Promise<Tarefa[]> => {
    try {
        const params = new URLSearchParams();
        if (filtros?.concluida !== undefined) params.append('concluida', String(filtros.concluida));
        if (filtros?.prioridade) params.append('prioridade', filtros.prioridade);

        const response = await axios.get(
            `${API_URL}/tarefas?${params.toString()}`,
            cabecalhoAuth(token),
        );

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        throw error;
    }
};

export const buscarPorId = async (id: number, token: string): Promise<Tarefa> => {
    try {
        const response = await axios.get(`${API_URL}/tarefas/${id}`, cabecalhoAuth(token));

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tarefa por ID:', error);
        throw error;
    }
};

export const atualizar = async (
    id: number,
    camposAtualizados: Partial<Omit<Tarefa, 'id' | 'criadaEm' | 'atualizadaEm' | 'usuarioId'>>,
    token: string,
): Promise<Tarefa> => {
    try {
        const response = await axios.put(
            `${API_URL}/tarefas/${id}`,
            camposAtualizados,
            cabecalhoAuth(token),
        );

        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        throw error;
    }
};

export const deletarPorId = async (id: number, token: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/tarefas/${id}`, cabecalhoAuth(token));
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        throw error;
    }
};
