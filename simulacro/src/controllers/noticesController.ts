import type { Request, Response, NextFunction } from 'express';

import * as noticesService from '../services/noticesService.js';
import { AppError, ResourceNotFoundError } from '../errors/AppError.js';

// Lista avisos aplicando paginación y búsqueda opcional por título.
// Las consultas inválidas se lanzan como AppError para que las gestione el
// middleware centralizado.
export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 2);
    const search = String(req.query.search ?? '').trim();

    // page debe ser un número entero positivo.
    if (!Number.isInteger(page) || page <= 0) {
      throw new AppError(400, 'Page must be a positive integer', 'BAD_REQUEST');
    }

    // limit debe ser un número entero positivo.
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new AppError(400, 'Limit must be a positive integer', 'BAD_REQUEST');
    }

    res.json(noticesService.list(page, limit, search));
  } catch (err) {
    next(err);
  }
}

// Busca un aviso por identificador y informa mediante ResourceNotFoundError
// si el recurso solicitado no existe.
export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    const noticeId = String(req.params.noticeId);
    const notice = noticesService.getById(noticeId);

    if (!notice) {
      throw new ResourceNotFoundError(
        404,
        `Notice with id '${noticeId}' not found`,
        'RESOURCE_NOT_FOUND',
        noticeId,
      );
    }

    res.json({ data: notice });
  } catch (err) {
    next(err);
  }
}

// Valida los datos recibidos antes de crear el recurso. title es obligatorio;
// description solo se acepta como cadena y puede omitirse.
export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body ?? {};

    // typeof evita aceptar números u otros tipos como título.
    if (typeof title !== 'string' || title.trim() === '') {
      throw new AppError(400, 'Invalid title', 'BAD_REQUEST');
    }

    // Verifica la descripción únicamente cuando el cliente la envía.
    if (description !== undefined && typeof description !== 'string') {
      throw new AppError(400, 'Invalid description', 'BAD_REQUEST');
    }

    // El servicio genera el identificador y la fecha de creación.
    const notice = noticesService.create(
      title.trim(),
      typeof description === 'string' ? description : '',
    );

    res.status(201).json({ data: notice });
  } catch (err) {
    next(err);
  }
}

// Actualiza solamente los campos válidos enviados mediante PATCH.
export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body ?? {};
    const noticeId = String(req.params.noticeId);

    // Si title aparece, debe ser una cadena no vacía.
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      throw new AppError(400, 'Invalid title', 'BAD_REQUEST');
    }

    // Si description aparece, debe ser una cadena.
    if (description !== undefined && typeof description !== 'string') {
      throw new AppError(400, 'Invalid description', 'BAD_REQUEST');
    }

    // Los campos ausentes llegan como undefined y el servicio los conserva.
    const notice = noticesService.update(noticeId, {
      title: typeof title === 'string' ? title.trim() : undefined,
      description: typeof description === 'string' ? description : undefined,
    });

    if (!notice) {
      throw new ResourceNotFoundError(
        404,
        `Notice with id '${noticeId}' not found`,
        'RESOURCE_NOT_FOUND',
        noticeId,
      );
    }

    res.json({ data: notice });
  } catch (err) {
    next(err);
  }
}
