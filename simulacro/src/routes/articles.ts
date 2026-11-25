// Relaciona cada método y ruta HTTP con su controlador correspondiente.

import { Router } from 'express';

import * as articlesController from '../controllers/articlesController.js';

export const articlesRouter = Router();

// /:articleId representa un parámetro variable que Express coloca en req.params.
articlesRouter.get('/', articlesController.list);
articlesRouter.post('/', articlesController.create);
articlesRouter.get('/:articleId', articlesController.getById);
articlesRouter.patch('/:articleId', articlesController.update);
