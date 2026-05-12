// src/context/AuthContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../api/auth';
import { User } from '../api/types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            try {
                if (token && isTokenExpired(token)) {
                    throw new Error('O token expirou');
                }

                if (token) {
                    const userData = await auth.validateToken(token);
                    setUser(userData);

                    const newToken = await getNewTokenIfNeeded(token);
                    if (newToken) {
                        setToken(newToken);
                        localStorage.setItem('token', newToken);
                    }
                }
            } catch (error) {
                console.error('Validação do token falhou:', error);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [token]);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const { user: userData, token: authToken } = await auth.login(email, password);
            setUser(userData);
            setToken(authToken);
            localStorage.setItem('token', authToken);
        } catch (error) {
            console.error('Falha no login:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isTokenExpired = (token: string): boolean => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (!payload.exp) return true;

            return Date.now() >= payload.exp * 1000;
        } catch (error) {
            console.error('Erro ao verificar expiração do token:', error);

            return true;
        }
    };

    const getNewTokenIfNeeded = async (currentToken: string): Promise<string | null> => {
        const tokenExpirationMargin = 15 * 60 * 1000;

        try {
            const payload = JSON.parse(atob(currentToken.split('.')[1]));
            if (!payload.exp) return null;

            const expiresAt = payload.exp * 1000;
            if (Date.now() > expiresAt - tokenExpirationMargin) {
                const newToken = await auth.refreshToken(currentToken);

                return newToken;
            }
        } catch (error) {
            console.error('Erro ao gerar novo token:', error);
        }

        return null;
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth precisa estar dentro de um AuthProvider');
    }

    return context;
};
