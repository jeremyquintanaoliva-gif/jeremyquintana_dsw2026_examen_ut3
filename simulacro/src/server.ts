import { env } from './config/env.js';
import { createApp } from './app.js';

// Punto de entrada de la aplicación: crea la instancia de Express y la
// pone a escuchar en el puerto configurado por variables de entorno.
const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});
