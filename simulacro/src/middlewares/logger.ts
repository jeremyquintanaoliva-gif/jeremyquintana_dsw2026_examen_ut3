import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export function logger(req: Request, res: Response, next: NextFunction): void {
  // OFF desactiva completamente los registros de esta petición.
  if (env.LOG === 'OFF') {
    next();
    return;
  }

  // performance.now permite medir la duración con precisión en milisegundos.
  const start = performance.now();
  const path = req.path;

  res.on('finish', () => {
    // El evento finish se dispara después de construir y enviar la respuesta.
    const duration = Math.round(performance.now() - start);
    const entry = {
      requestId: req.requestId,
      method: req.method,
      path,
      status: res.statusCode,
      durationMs: duration,
      timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(entry));
  });

  // next permite continuar hacia las rutas y el resto de middlewares.
  next();
}
