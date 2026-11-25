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
import { noticesRouter } from './routes/notices.js';

export function createApp(): Application {
  const app = express();

  // El orden de los middlewares es importante. requestId debe ejecutarse
  // primero para que el resto de la aplicación pueda usar el identificador.
  app.use(requestId);
  app.use(logger);
  // Convierte el cuerpo JSON recibido en req.body. Si el JSON está mal formado,
  // Express genera un SyntaxError que gestionará errorHandler.
  app.use(express.json());

  // Montaje de cada API bajo su prefijo. Cada router se encarga de conectar
  // los métodos HTTP con sus controladores.
  app.use('/health', healthRouter);
  app.use('/api/v1/articles', articlesRouter);
  app.use('/api/v1/documents', documentsRouter);
  app.use('/api/v1/questions', questionsRouter);
  app.use('/api/v1/notices', noticesRouter);

  // Estos middlewares deben registrarse al final:
  // - notFound responde cuando ninguna ruta anterior ha atendido la petición.
  // - errorHandler recibe los errores mediante next(error).
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
