export interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    createdAt?: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
    };
}
