import { Router } from 'express';
import * as documentsController from '../controllers/documentsController.js';

export const documentsRouter = Router();

// GET de colección: devuelve una lista paginada.
documentsRouter.get('/', documentsController.list);

// POST de colección: crea un nuevo recurso.
documentsRouter.post('/', documentsController.create);

// GET de recurso: consulta el documento identificado por documentId.
documentsRouter.get('/:documentId', documentsController.getById);

// PATCH de recurso: modifica solo los campos enviados por el cliente.
documentsRouter.patch('/:documentId', documentsController.update);
