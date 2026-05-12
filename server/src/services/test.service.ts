import { prisma } from '../utils/prisma';

export class TestService {
    static async resetDatabase() {
        await prisma.task.deleteMany();
        await prisma.user.deleteMany();

        await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name = "Task";');
        await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name = "User";');
    }
}
