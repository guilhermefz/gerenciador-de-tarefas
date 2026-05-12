import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CreateTask } from './pages/CreateTask';
import { EditTask } from './pages/EditTask';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TaskDetail } from './pages/TaskDetail';
import { TaskList } from './pages/TaskList';

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/tasks"
                        element={
                            <ProtectedRoute>
                                <TaskList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tasks/create"
                        element={
                            <ProtectedRoute>
                                <CreateTask />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tasks/:id"
                        element={
                            <ProtectedRoute>
                                <TaskDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tasks/:id/edit"
                        element={
                            <ProtectedRoute>
                                <EditTask />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
        </div>
    );
}

export default App;
