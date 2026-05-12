import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        <div className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-slate-900 px-6 sm:px-8">
            <div className="text-center max-w-xl w-full">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                    Bem-vindo ao <span className="text-indigo-400">Gerenciador de Tarefas</span>
                </h1>
                <p className="text-slate-400 text-lg mb-10">
                    Organize suas tarefas com eficiência e aumente sua produtividade.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/login"
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-700 to-indigo-400 text-white rounded-lg shadow-md hover:brightness-110 transition text-center"
                    >
                        Entrar
                    </Link>
                    <Link
                        to="/register"
                        className="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition text-center"
                    >
                        Cadastrar-se
                    </Link>
                </div>
            </div>
        </div>
    );
};
