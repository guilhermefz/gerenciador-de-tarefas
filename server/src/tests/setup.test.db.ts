import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';

export let testUser: { id: number; email: string; password: string };

export const setupTestDB = async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name = "User";');
    await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name = "Task";');

    const plainPassword = 'Senha123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const uniqueEmail = `usuario_${Date.now()}@exemplo.teste`;

    const user = await prisma.user.create({
        data: {
            email: uniqueEmail,
            name: 'Usuário Exemplo',
            password: hashedPassword,
        },
    });

    testUser = { id: user.id, email: uniqueEmail, password: plainPassword };
};

export const disconnectTestDB = async () => {
    await prisma.$disconnect();
};
