import { ClipboardList, AlertTriangle, RotateCcw } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { buscar } from '../../api/index';
import { Tarefa } from '../../api/types';
import { TaskCard } from '../../components/TaskCard';
import { useAuth } from '../../context/AuthContext';

export const TaskList = () => {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [estaCarregando, setEstaCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const { token } = useAuth();

    const buscarTarefas = useCallback(async () => {
        if (!token) return;

        setEstaCarregando(true);
        setErro(null);

        try {
            const dados = await buscar(token);
            setTarefas(dados);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            setErro('Não foi possível carregar as tarefas.');
        } finally {
            setEstaCarregando(false);
        }
    }, [token]);

    useEffect(() => {
        buscarTarefas();
    }, [buscarTarefas]);

    if (estaCarregando) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-68px)] bg-slate-900 text-white">
                <span className="text-lg animate-pulse">Carregando tarefas...</span>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-68px)] bg-slate-900 text-white px-4 text-center">
                <AlertTriangle size={48} className="text-yellow-500 mb-4" />
                <p className="text-lg font-medium mb-2">{erro}</p>
                <button
                    onClick={buscarTarefas}
                    className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg transition mt-2"
                >
                    <RotateCcw size={18} /> Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-68px)] bg-slate-900 text-white px-6 py-8">
            <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                    <ClipboardList size={28} /> Minhas Tarefas
                </h2>
                <Link
                    to="/tasks/create"
                    className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg transition"
                >
                    Criar Tarefa
                </Link>
            </div>

            <div className="max-w-4xl mx-auto space-y-6" data-testid="task-list">
                {tarefas.length === 0 ? (
                    <p className="text-center text-slate-400 text-lg" data-testid="empty-state">
                        Nenhuma tarefa encontrada. Crie sua primeira tarefa!
                    </p>
                ) : (
                    tarefas.map((tarefa) => <TaskCard tarefa={tarefa} key={tarefa.id} />)
                )}
            </div>
        </div>
    );
};
