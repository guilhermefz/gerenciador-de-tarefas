import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../api/autenticacao';
import { Usuario } from '../api/types';

interface ContextoAutenticacaoTipo {
    usuario: Usuario | null;
    token: string | null;
    fazerLogin: (email: string, senha: string) => Promise<void>;
    sair: () => void;
    estaAutenticado: boolean;
    estaCarregando: boolean;
}

const ContextoAutenticacao = createContext<ContextoAutenticacaoTipo | undefined>(undefined);

export const ProvedorAutenticacao = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [estaCarregando, setEstaCarregando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verificarToken = async () => {
            try {
                if (token && tokenExpirou(token)) {
                    throw new Error('O token expirou');
                }

                if (token) {
                    const dadosUsuario = await auth.validarToken(token);
                    setUsuario(dadosUsuario);

                    const novoToken = await renovarTokenSeNecessario(token);
                    if (novoToken) {
                        setToken(novoToken);
                        localStorage.setItem('token', novoToken);
                    }
                }
            } catch (error) {
                console.error('Validação do token falhou:', error);
                sair();
            } finally {
                setEstaCarregando(false);
            }
        };

        verificarToken();
    }, [token]);

    const fazerLogin = async (email: string, senha: string) => {
        try {
            setEstaCarregando(true);
            const { usuario: dadosUsuario, token: tokenAutenticacao } = await auth.entrar(email, senha);
            setUsuario(dadosUsuario);
            setToken(tokenAutenticacao);
            localStorage.setItem('token', tokenAutenticacao);
        } catch (error) {
            console.error('Falha no login:', error);
            throw error;
        } finally {
            setEstaCarregando(false);
        }
    };

    const sair = () => {
        setUsuario(null);
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    const tokenExpirou = (tokenAtual: string): boolean => {
        try {
            const payload = JSON.parse(atob(tokenAtual.split('.')[1]));
            if (!payload.exp) return true;

            return Date.now() >= payload.exp * 1000;
        } catch (error) {
            console.error('Erro ao verificar expiração do token:', error);

            return true;
        }
    };

    const renovarTokenSeNecessario = async (tokenAtual: string): Promise<string | null> => {
        const margemExpiracao = 15 * 60 * 1000;

        try {
            const payload = JSON.parse(atob(tokenAtual.split('.')[1]));
            if (!payload.exp) return null;

            const expiraEm = payload.exp * 1000;
            if (Date.now() > expiraEm - margemExpiracao) {
                const novoToken = await auth.renovarToken(tokenAtual);

                return novoToken;
            }
        } catch (error) {
            console.error('Erro ao gerar novo token:', error);
        }

        return null;
    };

    const valor = {
        usuario,
        token,
        fazerLogin,
        sair,
        estaAutenticado: !!usuario && !!token,
        estaCarregando,
    };

    return <ContextoAutenticacao.Provider value={valor}>{children}</ContextoAutenticacao.Provider>;
};

export const useAuth = (): ContextoAutenticacaoTipo => {
    const contexto = useContext(ContextoAutenticacao);
    if (contexto === undefined) {
        throw new Error('useAuth precisa estar dentro de um ProvedorAutenticacao');
    }

    return contexto;
};
