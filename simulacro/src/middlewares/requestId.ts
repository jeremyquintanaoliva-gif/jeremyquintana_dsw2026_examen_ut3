import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

declare global {
  // Amplía el tipo Request de Express con requestId. Así TypeScript permite
  // leer y escribir esta propiedad en todos los middlewares y controladores.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export function requestId(req: Request, _res: Response, next: NextFunction): void {
  // Se genera un UUID distinto por petición para correlacionar sus registros.
  req.requestId = randomUUID();
  next();
}
