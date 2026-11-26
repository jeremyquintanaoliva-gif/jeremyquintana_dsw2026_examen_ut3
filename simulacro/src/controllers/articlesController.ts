// Capa HTTP de artículos. Recibe req/res, valida datos y delega la lógica
// al servicio. Los errores se pasan a errorHandler mediante next(err).

import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';
import * as articlesService from '../services/articlesService.js';

export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    // ?? conserva el valor predeterminado solo si page o limit son undefined.
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    if (!Number.isInteger(page) || page <= 0) {
      throw new AppError(400, 'Page must be a positive integer', 'BAD_REQUEST');
    }

    if (!Number.isInteger(limit) || limit <= 0) {
      throw new AppError(400, 'Limit must be a positive integer', 'BAD_REQUEST');
    }

    res.json(articlesService.list(page, limit));
  } catch (err) {
    next(err);
  }
}

export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    const article = articlesService.getById(String(req.params.articleId));
    if (!article) {
      throw new AppError(404, `Article with id '${req.params.articleId}' not found`, 'NOT_FOUND');
    }
    res.json({ data: article });
  } catch (err) {
    next(err);
  }
}

export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body ?? {};
    if (typeof title !== 'string' || title.trim() === '') {
      throw new AppError(400, 'Invalid title', 'BAD_REQUEST');
    }

    if (description !== undefined && typeof description !== 'string') {
      throw new AppError(400, 'Invalid description', 'BAD_REQUEST');
    }

    const article = articlesService.create(
      title.trim(),
      typeof description === 'string' ? description.trim() : '',
    );
    res.status(201).json({ data: article });
  } catch (err) {
    next(err);
  }
}

export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body ?? {};

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      throw new AppError(400, 'Invalid title', 'BAD_REQUEST');
    }

    if (description !== undefined && typeof description !== 'string') {
      throw new AppError(400, 'Invalid description', 'BAD_REQUEST');
    }

    const article = articlesService.update(String(req.params.articleId), {
      title: typeof title === 'string' ? title.trim() : undefined,
      description: typeof description === 'string' ? description.trim() : undefined,
    });
    if (!article) {
      throw new AppError(404, `Article with id '${req.params.articleId}' not found`, 'NOT_FOUND');
    }
    res.json({ data: article });
  } catch (err) {
    next(err);
  }
}
