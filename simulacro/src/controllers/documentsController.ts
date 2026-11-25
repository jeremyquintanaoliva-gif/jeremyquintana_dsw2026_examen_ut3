import type { Request, Response, NextFunction } from 'express';

import * as documentsService from '../services/documentsService.js';
import { AppError, ResourceNotFoundError } from '../errors/AppError.js';

// Lista una página de documentos y permite enviar page y limit como parámetros.
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
      throw new ResourceNotFoundError(
        404,
        `Document with id '${req.params.documentId}' not found`,
        'RESOURCE_NOT_FOUND',
        String(req.params.documentId),
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

    // Comprobar el título antes de llamar al servicio
    if (
      title !== undefined &&
      (typeof title !== 'string' || title.trim() === '')
    ) {
      res.status(400).json({
        error: 'INVALID_TITLE',
        message: 'Title must be a non-empty string',
      });
      return;
    }

    // Comprobar la descripción
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
      throw new ResourceNotFoundError(
        404,
        `Document with id '${req.params.documentId}' not found`,
        'RESOURCE_NOT_FOUND',
        String(req.params.documentId),
      );
    }

    res.json({ data: document });
  } catch (err) {
    next(err);
  }
}