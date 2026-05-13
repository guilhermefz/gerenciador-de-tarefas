import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TesteService } from '../services/teste.service';

export const resetarBancoDeDados = async (req: Request, res: Response): Promise<void> => {
    try {
        await TesteService.resetarBancoDeDados();
        res.status(StatusCodes.OK).send();
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
};
