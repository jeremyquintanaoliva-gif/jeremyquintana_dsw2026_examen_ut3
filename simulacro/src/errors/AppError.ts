// Error HTTP controlado para indicar problemas conocidos de una petición.
// El controlador lanza esta clase y errorHandler la convierte en una
// respuesta JSON con su estado HTTP y su código.
export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, message: string, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

export class ResourceNotFoundError extends Error {
  // Variante de error usada cuando se solicita un recurso concreto que no existe.
  statusCode: number;
  code: string;
  resourceId: string;

  constructor(statusCode: number, message: string, code: string, resourceId: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.resourceId = resourceId;
    this.name = 'ResourceNotFoundError';
  }
}
