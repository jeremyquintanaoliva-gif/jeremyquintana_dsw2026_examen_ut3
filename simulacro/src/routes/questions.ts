import { Router } from 'express';
import * as questionsController from '../controllers/questionsController.js';

export const questionsRouter = Router();

// POST recibe la pregunta en el cuerpo JSON de la petición.
questionsRouter.post('/', questionsController.ask);
