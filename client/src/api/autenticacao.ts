import axios from 'axios';
import { RespostaAutenticacao, Usuario } from './types';

const API_URL = import.meta.env.VITE_API_URL;

export const entrar = async (email: string, senha: string): Promise<RespostaAutenticacao> => {
    try {
        const response = await axios.post(`${API_URL}/autenticacao/entrar`, { email, senha });

        return response.data;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
};

export const registrar = async (
    nome: string,
    email: string,
    senha: string,
): Promise<RespostaAutenticacao> => {
    try {
        const response = await axios.post(`${API_URL}/autenticacao/registrar`, { nome, email, senha });

        return response.data;
    } catch (error) {
        console.error('Erro no cadastro:', error);
        throw error;
    }
};

export const buscarUsuarioAtual = async (token: string): Promise<RespostaAutenticacao['usuario']> => {
    try {
        const response = await axios.get(`${API_URL}/autenticacao/perfil`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
};

export const validarToken = async (token: string): Promise<Usuario> => {
    try {
        const response = await axios.get(`${API_URL}/autenticacao/validar`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.usuario;
    } catch (error) {
        console.error('Erro ao validar token:', error);
        throw error;
    }
};

export const renovarToken = async (tokenAntigo: string): Promise<string> => {
    try {
        const response = await axios.post(
            `${API_URL}/autenticacao/renovar`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${tokenAntigo}`,
                },
            },
        );

        return response.data.token;
    } catch (error) {
        console.error('Erro ao renovar token:', error);
        throw error;
    }
};
