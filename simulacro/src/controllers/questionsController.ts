import type { Request, Response, NextFunction } from 'express';
import * as questionsService from '../services/questionsService.js';
import { AppError } from '../errors/AppError.js';

// Valida la pregunta recibida y devuelve una respuesta simulada.
export function ask(req: Request, res: Response, next: NextFunction): void {
  try {
    const { question } = req.body;

    // Una pregunta debe existir, ser una cadena y contener texto útil.
    if (typeof question !== 'string' || question.trim().length === 0) {
      throw new AppError(400, 'Invalid question', 'INVALID_QUESTION');
    }

    // El servicio no consulta una IA real: devuelve datos demostrativos.
    const answer = questionsService.answerQuestion();
    res.status(200).json({ data: answer });
  } catch (err) {
    next(err);
  }
}
