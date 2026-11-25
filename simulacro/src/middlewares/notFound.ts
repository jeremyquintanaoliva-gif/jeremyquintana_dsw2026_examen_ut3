import type { Request, Response } from 'express';

export function notFound(req: Request, res: Response): void {
  // Este middleware solo debe ejecutarse si ninguna ruta anterior respondió.
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route not found: ${req.method} ${req.path}`,
  });
}
