// Capa de rutas: relaciona cada método HTTP y cada ruta con su controlador.
// La información de la petición se gestiona en el controlador y los datos
// se gestionan en el servicio.

import { Router } from 'express';

import * as articlesController from '../controllers/articlesController.js';

export const articlesRouter = Router();

articlesRouter.get('/', articlesController.list);
articlesRouter.post('/', articlesController.create);
articlesRouter.get('/:articleId', articlesController.getById);
articlesRouter.patch('/:articleId', articlesController.update);
