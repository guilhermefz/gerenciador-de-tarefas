import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrar } from '../../api/index';

export const Register = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setSucesso(false);
        try {
            await registrar(nome, email, senha);
            setSucesso(true);
            setNome('');
            setEmail('');
            setSenha('');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            console.error(err);
            setErro('Erro ao registrar. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-slate-900 px-6">
            <div className="w-full max-w-md bg-slate-950 text-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">Criar conta</h2>

                {erro && <p className="mb-4 text-red-400 text-sm text-center" data-testid="error-message">{erro}</p>}

                {sucesso && (
                    <div className="mb-4 flex items-center justify-center space-x-2 bg-green-700 bg-opacity-80 rounded-md p-3" data-testid="success-message">
                        <svg
                            className="w-5 h-5 text-green-300"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            ></path>
                        </svg>
                        <span className="text-green-300 text-sm font-semibold">
                            Cadastro realizado com sucesso! Redirecionando para login...
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome</label>
                        <input
                            placeholder="Digite o nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            disabled={sucesso}
                            data-testid="name-input"
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-slate-800 disabled:text-slate-400 disabled:border-slate-600 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">E-mail</label>
                        <input
                            placeholder="Digite o e-mail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={sucesso}
                            data-testid="email-input"
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-slate-800 disabled:text-slate-400 disabled:border-slate-600 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Senha</label>
                        <input
                            placeholder="Digite a senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            disabled={sucesso}
                            data-testid="password-input"
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-slate-800 disabled:text-slate-400 disabled:border-slate-600 disabled:cursor-not-allowed"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-700 to-indigo-900 transition hover:brightness-110 ${
                            !sucesso ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                        } flex justify-center items-center`}
                        disabled={sucesso}
                        data-testid="register-button"
                    >
                        {sucesso ? (
                            <>
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
                                Redirecionando...
                            </>
                        ) : (
                            'Registrar'
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400 mt-6">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="text-indigo-400 hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    );
};
