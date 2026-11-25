
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export function logger(req: Request, res: Response, next: NextFunction): void {
  // LOG permite activar o desactivar temporalmente el registro de peticiones.
  if (env.LOG === 'OFF') {
    next(); // Permite que la petición continúe hacia las siguientes rutas y middlewares
    return; // Evita que se ejecute el resto del logger
  }

  const start = performance.now(); // Empieza a medir lo que tarda la petición

  res.on('finish', () => {
    // Se ejecuta cuando la petición ha terminado después de pasar por todos los middlewares y handlers
    const duration = Math.round(performance.now() - start); // Calcula la duración de la petición en milisegundos

    const entry = {
      requestId: req.requestId, // Identificador único de la petición
      method: req.method, // Método HTTP utilizado
      path: req.path, // Ruta solicitada
      status: res.statusCode, // Código de respuesta HTTP
      durationMs: duration, // Tiempo que ha tardado la petición
      timestamp: new Date().toISOString(), // Fecha y hora de la petición
    };

    console.log(JSON.stringify(entry)); // Loguea en pantalla la información de la petición
  });

  next(); // Continúa la petición hacia los siguientes middlewares y handlers
}
