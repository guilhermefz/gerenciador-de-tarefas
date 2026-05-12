import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/tasks');
        } catch (err) {
            console.error(err);
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-slate-900 px-6">
            <div className="w-full max-w-md bg-slate-950 text-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">Entrar</h2>

                {error && (
                    <p className="error-message mb-4 text-red-400 text-sm text-center" data-testid="error-message">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
                    <div>
                        <label className="block text-sm font-medium mb-1">E-mail</label>
                        <input
                            name="email"
                            placeholder="Digite o e-mail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            data-testid="email-input"
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-slate-800 disabled:text-slate-400 disabled:border-slate-600 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Senha</label>
                        <input
                            name="password"
                            placeholder="Digite a senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            data-testid="password-input"
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-slate-800 disabled:text-slate-400 disabled:border-slate-600 disabled:cursor-not-allowed"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-700 to-indigo-900 transition hover:brightness-110 ${
                            !loading ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                        } flex justify-center items-center`}
                        disabled={loading}
                        data-testid="login-button"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                        ) : null}
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};
