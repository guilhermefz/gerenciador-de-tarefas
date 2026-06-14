import axios from 'axios';
import { Comentario } from './types';

const API_URL = import.meta.env.VITE_API_URL;

const cabecalhoAuth = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const buscarComentarios = async (tarefaId: number, token: string): Promise<Comentario[]> => {
    try {
        const response = await axios.get(`${API_URL}/tarefas/${tarefaId}/comentarios`, cabecalhoAuth(token));
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        throw error;
    }
};

export const criarComentario = async (
    tarefaId: number,
    texto: string,
    token: string,
): Promise<Comentario> => {
    try {
        const response = await axios.post(
            `${API_URL}/tarefas/${tarefaId}/comentarios`,
            { texto },
            cabecalhoAuth(token),
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        throw error;
    }
};

export const deletarComentario = async (
    tarefaId: number,
    comentarioId: number,
    token: string,
): Promise<void> => {
    try {
        await axios.delete(
            `${API_URL}/tarefas/${tarefaId}/comentarios/${comentarioId}`,
            cabecalhoAuth(token),
        );
    } catch (error) {
        console.error('Erro ao deletar comentário:', error);
        throw error;
    }
};
