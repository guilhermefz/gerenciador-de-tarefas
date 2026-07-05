import { Router } from 'express';
import * as comentarioController from '../controllers/comentario.controller';

const router = Router({ mergeParams: true });

router.post('/', comentarioController.criarComentario);
router.get('/', comentarioController.buscarComentarios);
router.delete('/:id', comentarioController.deletarComentario);

export default router;
