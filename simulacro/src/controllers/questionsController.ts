
import type { Request, Response, NextFunction } from 'express';
import * as questionsService from '../services/questionsService.js';
import { AppError } from '../errors/AppError.js';

// Responder una pregunta
export function ask(req: Request, res: Response, next: NextFunction): void {
  try {
    const { question } = req.body;

    if (typeof question !== 'string' || question.trim().length === 0) {
      throw new AppError(400, 'Invalid question', 'INVALID_QUESTION');
    }

    const answer = questionsService.answerQuestion();

    res.status(200).json({ data: answer });
  } catch (err) {
    next(err);
  }
}
