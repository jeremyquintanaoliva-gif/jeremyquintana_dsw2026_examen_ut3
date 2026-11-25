import { Router } from 'express';

export const healthRouter = Router();

// live indica que el proceso está activo.
healthRouter.get('/live', (_req, res) => {
  res.status(200).json({ status: 'live' });
});

healthRouter.get('/ready', (_req, res) => {
  // ready indica que la aplicación está preparada para atender peticiones.
  res.status(200).json({ status: 'ready' });
});

healthRouter.get('/test', (_req, res) => {
  // test se usa como respuesta identificativa del equipo o ejercicio.
  res.status(200).json({ team: 'Los Makinas' });
});
