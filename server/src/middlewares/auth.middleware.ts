import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { prisma } from '../utils/prisma';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Autenticação necessária' });

            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token inválido' });

            return;
        }

        req.userId = user.id;
        next();
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token inválido ou expirado', error });
    }
};
