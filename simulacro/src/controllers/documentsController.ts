
import type { Request, Response, NextFunction } from 'express';
import * as documentsService from '../services/documentsService.js';
import { AppError } from '../errors/AppError.js';

// Listar documentos
export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    res.json(documentsService.list(page, limit));
  } catch (err) {
    next(err);
  }
}

// Obtener documento por ID
export function getById(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const document = documentsService.getById(String(req.params.documentId));

    if (!document) {
      throw new AppError(
        404,
        `Document with id '${req.params.documentId}' not found`,
        'NOT_FOUND',
      );
    }

    res.json({ data: document });
  } catch (err) {
    next(err);
  }
}

// Crear documento
export function create(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== 'string') {
      throw new AppError(400, 'Missing required field: title', 'BAD_REQUEST');
    }

    const document = documentsService.create(
      title.trim(),
      typeof description === 'string' ? description.trim() : '',
    );

    res.status(201).json({ data: document });
  } catch (err) {
    next(err);
  }
}

// Modificar documento
export function update(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const { title, description } = req.body;

    if (title !== undefined && typeof title !== 'string') {
      throw new AppError(400, 'Invalid title', 'BAD_REQUEST');
    }

    if (description !== undefined && typeof description !== 'string') {
      throw new AppError(400, 'Invalid description', 'BAD_REQUEST');
    }

    const document = documentsService.update(
      String(req.params.documentId),
      {
        title: typeof title === 'string' ? title.trim() : undefined,
        description:
          typeof description === 'string' ? description.trim() : undefined,
      },
    );

    if (!document) {
      throw new AppError(
        404,
        `Document with id '${req.params.documentId}' not found`,
        'NOT_FOUND',
      );
    }

    res.json({ data: document });
  } catch (err) {
    next(err);
  }
}
