import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RotaProtegidaProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: RotaProtegidaProps) => {
    const { estaAutenticado, estaCarregando } = useAuth();

    if (estaCarregando) {
        return <div>Carregando...</div>;
    }

    if (!estaAutenticado) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
