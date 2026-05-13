import { LogOut, ListTodo, LogIn, UserPlus, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
    const { usuario, estaAutenticado, sair } = useAuth();
    const [menuAberto, setMenuAberto] = useState(false);
    const navigate = useNavigate();

    const handleLogoClick = () => {
        if (estaAutenticado) {
            navigate('/tasks');
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <button
                    onClick={handleLogoClick}
                    className="text-2xl font-bold tracking-tight hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer"
                >
                    Gerenciador de Tarefas
                </button>

                <ul className="flex items-center gap-2 sm:gap-4 relative">
                    {estaAutenticado ? (
                        <li className="relative">
                            <button
                                onClick={() => setMenuAberto(!menuAberto)}
                                data-testid="user-name"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-md hover:bg-slate-700 transition text-sm font-medium"
                            >
                                {usuario?.nome}
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {menuAberto && (
                                <ul className="absolute right-0 mt-2 w-48 bg-slate-800 text-white rounded-lg shadow-lg text-sm overflow-hidden border border-slate-700 z-50">
                                    <li>
                                        <Link
                                            to="/tasks"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition"
                                            onClick={() => setMenuAberto(false)}
                                        >
                                            <ListTodo className="w-4 h-4" />
                                            Minhas tarefas
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                sair();
                                                setMenuAberto(false);
                                            }}
                                            data-testid="logout-button"
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-700 transition"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sair
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-700 to-indigo-400 rounded-md hover:brightness-110 transition text-sm font-medium"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Entrar
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-md hover:bg-slate-100 transition text-sm font-medium"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Cadastrar-se
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};
