// Error HTTP controlado. Los controladores lo lanzan cuando reciben datos
// inválidos o no encuentran un recurso; errorHandler traduce el error a JSON.
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
  statusCode: number;
  code: string;
  resourceId: string;

  constructor(
    statusCode: number,
    message: string,
    code: string,
    resourceId: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.resourceId = resourceId;
    this.name = 'ResourceNotFoundError';
  }
}