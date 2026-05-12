import { CalendarDays, ClipboardList, CheckCircle, AlertTriangle, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Task } from '../../api/types';
import { getPriorityColor, getPriorityLabel } from '../../utils';

const formatDate = (dateString?: string) => {
    if (!dateString) return null;

    return new Date(dateString).toLocaleDateString('pt-BR');
};

export const TaskCard = ({ task }: { task: Task }) => (
    <div
        key={task.id}
        data-testid={`task-card-${task.id}`}
        className="bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-lg hover:bg-slate-700 transition border border-slate-700"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1">
                <Link
                    to={`/tasks/${task.id}`}
                    className="text-xl font-bold text-indigo-300 hover:underline flex items-center gap-2"
                >
                    <ClipboardList size={20} /> {task.title}
                </Link>

                <div className="flex gap-4 text-sm text-slate-400 mt-1">
                    <div className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {task.dueDate ? (
                            <span>{formatDate(task.dueDate)}</span>
                        ) : (
                            <span className="italic">Sem prazo</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className={`${getPriorityColor(task.priority)} font-medium`}>●</span>
                        <span>{getPriorityLabel(task.priority)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {task.completed ? (
                            <>
                                <CheckCircle size={14} className="text-green-400" />
                                <span className="text-green-400">Concluída</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle size={14} className="text-yellow-400" />
                                <span className="text-yellow-400">Pendente</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Link
                to={`/tasks/${task.id}/edit`}
                className="text-slate-400 hover:text-indigo-400 transition"
            >
                <Pencil size={18} />
            </Link>
        </div>

        {task.description && <p className="text-slate-300">{task.description}</p>}
    </div>
);
