import { Router } from 'express';

import * as noticesController from '../controllers/noticesController.js';

export const noticesRouter = Router();

// GET /: devuelve todas las coincidencias aplicando paginación y búsqueda.
noticesRouter.get('/', noticesController.list);

// GET /:noticeId: consulta un aviso concreto.
noticesRouter.get('/:noticeId', noticesController.getById);

// POST /: crea un aviso nuevo.
noticesRouter.post('/', noticesController.create);

// PATCH /:noticeId: modifica únicamente los campos enviados.
noticesRouter.patch('/:noticeId', noticesController.update);
