
import { Router } from 'express';
import * as documentsController from '../controllers/documentsController.js';

export const documentsRouter = Router();

// Listar documentos
documentsRouter.get('/', documentsController.list);

// Crear documento
documentsRouter.post('/', documentsController.create);

// Obtener documento por ID
documentsRouter.get('/:documentId', documentsController.getById);

// Modificar documento
documentsRouter.patch('/:documentId', documentsController.update);
