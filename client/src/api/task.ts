import axios from 'axios';
import { Task } from './types';

const API_URL = import.meta.env.VITE_API_URL;

const authHeader = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const create = async (
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'userId'>,
    token: string,
): Promise<Task> => {
    try {
        const response = await axios.post(`${API_URL}/tasks`, task, authHeader(token));

        return response.data;
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        throw error;
    }
};

export const get = async (
    token: string,
    filters?: { completed?: boolean; priority?: string },
): Promise<Task[]> => {
    try {
        const params = new URLSearchParams();
        if (filters?.completed !== undefined) params.append('completed', String(filters.completed));
        if (filters?.priority) params.append('priority', filters.priority);

        const response = await axios.get(
            `${API_URL}/tasks?${params.toString()}`,
            authHeader(token),
        );

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        throw error;
    }
};

export const getById = async (id: number, token: string): Promise<Task> => {
    try {
        const response = await axios.get(`${API_URL}/tasks/${id}`, authHeader(token));

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tarefa por ID:', error);
        throw error;
    }
};

export const update = async (
    id: number,
    updatedFields: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>,
    token: string,
): Promise<Task> => {
    try {
        const response = await axios.put(
            `${API_URL}/tasks/${id}`,
            updatedFields,
            authHeader(token),
        );

        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        throw error;
    }
};

export const deleteById = async (id: number, token: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/tasks/${id}`, authHeader(token));
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        throw error;
    }
};
