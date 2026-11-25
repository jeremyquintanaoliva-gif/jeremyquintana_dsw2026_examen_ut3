import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.js';
import { AppError, ResourceNotFoundError } from '../errors/AppError.js';

// Express reconoce este gestor de errores porque tiene CUATRO parámetros.
// _next no se utiliza, pero es obligatorio: con solo tres parámetros Express
// lo trataría como un middleware normal y no le entregaría los errores.
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const isProduction = env.NODE_ENV === 'production';

  console.error(
    JSON.stringify({
      requestId: req.requestId,
      error: err.message,
      stack: isProduction ? undefined : err.stack,
    }),
  );

  // ResourceNotFoundError incluye el identificador que no se pudo encontrar,
  // por lo que la respuesta puede dar un contexto más concreto que un error 404 normal.
  if (err instanceof ResourceNotFoundError) {
  res.status(err.statusCode).json({
    message: err.message,
    resourceId: err.resourceId,
  });
  return;
  }

  if (err instanceof AppError) {
  res.status(err.statusCode).json({
    error: err.code ?? 'ERROR',
    message: err.message,
  });
  return;
  }

  // express.json() lanza SyntaxError cuando el cuerpo no contiene JSON válido.
  // El problema pertenece al cliente, por lo que se responde con 400.
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'INVALID_JSON', message: 'Request body is not valid JSON' });
    return;
  }

  // Cualquier otro error es inesperado: se responde con 500.
  // En producción no se muestran detalles internos de la excepción.
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: isProduction ? 'An unexpected error occurred' : err.message,
  });
}
