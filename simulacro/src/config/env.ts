// Lee el archivo .env y carga sus valores en process.env.
// Node.js utiliza estos datos para la configuración de la aplicación.
process.loadEnvFile();

export const env = {
  // Number convierte el texto recibido desde el entorno a número.
  // Si PORT no existe, se utiliza el puerto 4000.
  PORT: Number(process.env.PORT ?? 4000),
  // El modo por defecto es development. En producción se esconden detalles
  // internos sensibles de las respuestas y los registros.
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  APP_NAME: process.env.APP_NAME ?? 'connectia',
  // El logger está activo salvo que la variable esté configurada como OFF.
  LOG: process.env.LOG ?? 'ON',
};
