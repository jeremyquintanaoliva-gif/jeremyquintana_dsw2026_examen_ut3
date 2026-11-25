import express from 'express';
import type { Application } from 'express';

import { documentsRouter } from './routes/documents.js';
import { healthRouter } from './routes/health.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import { notFound } from './middlewares/notFound.js';
import { requestId } from './middlewares/requestId.js';
import { articlesRouter } from './routes/articles.js';
import { questionsRouter } from './routes/questions.js';

export function createApp(): Application {
  const app = express();

  // El orden importa: requestId crea el identificador antes de que logger y
  // los demás middlewares puedan registrarlo o devolverlo en una respuesta.
  app.use(requestId); // Genera el identificador antes de pasar por el resto.
  app.use(logger);
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/api/v1/articles', articlesRouter);
  app.use('/api/v1/documents', documentsRouter);
  app.use('/api/v1/questions', questionsRouter);

  // Estos dos controles deben quedar al final: notFound solo recibe peticiones
  // que no coincidieron con ninguna ruta y errorHandler procesa los errores.
  app.use(notFound); // Solo responde si ninguna ruta ha atendido la petición.
  app.use(errorHandler); // Debe ir último para recibir los errores del resto.

  return app;
}
