import type { Request, Response, NextFunction } from 'express';

import * as documentsService from '../services/documentsService.js';
import { AppError, ResourceNotFoundError } from '../errors/AppError.js';

// Convierte los parámetros de paginación y delega la consulta al servicio.
// Los parámetros llegan como texto desde la URL y Number los transforma a números.
export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    res.json(documentsService.list(page, limit));
  } catch (err) {
    next(err);
  }
}

// Busca un documento por su identificador. Si no existe, crea un error
// especializado que el middleware central devolverá como una respuesta 404.
export function getById(req: Request, res: Response, next: NextFunction): void {
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

// Valida el título obligatorio y delega la creación al servicio.
// La descripción es opcional y solo se acepta si es una cadena de texto.
export function create(req: Request, res: Response, next: NextFunction): void {
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

// Valida únicamente los campos enviados antes de aplicar la modificación.
// Al ser PATCH, title y description son opcionales y pueden actualizarse por separado.
export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body;

    // trim() elimina espacios iniciales y finales. Si queda vacío,
    // el título no es válido aunque el texto original solo contuviera espacios.
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      res.status(400).json({
        error: 'INVALID_TITLE',
        message: 'Title must be a non-empty string',
      });
      return;
    }

    // Una descripción presente debe ser siempre una cadena.
    if (description !== undefined && typeof description !== 'string') {
      throw new AppError(400, 'Invalid description', 'BAD_REQUEST');
    }

    // undefined significa "no modificar este campo". trim() normaliza el
    // título y la descripción antes de enviarlos al servicio.
    const document = documentsService.update(String(req.params.documentId), {
      title: typeof title === 'string' ? title.trim() : undefined,
      description: typeof description === 'string' ? description.trim() : undefined,
    });

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
