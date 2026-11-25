// Capa de lógica y datos de artículos. No depende de Express, por lo que
// puede ejecutarse independientemente de las peticiones HTTP.

import { randomUUID } from 'node:crypto';

export interface Article {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface ArticleChanges {
  title?: string;
  description?: string;
}

// Almacenamiento temporal en memoria. Los cambios se pierden al reiniciar
// el servidor porque este simulacro todavía no usa una base de datos.
const articles: Article[] = [];

export function list(page: number, limit: number) {
  // page 1 comienza en el índice 0; restar 1 permite calcular el inicio.
  const start = (page - 1) * limit;
  return {
    data: articles.slice(start, start + limit),
    pagination: { page, limit, total: articles.length },
  };
}

export function getById(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

export function create(title: string, description: string): Article {
  // randomUUID crea un identificador único para el nuevo recurso.
  const article: Article = {
    id: randomUUID(),
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  articles.push(article);
  return article;
}

export function update(id: string, changes: ArticleChanges): Article | undefined {
  const article = getById(id);
  if (!article) {
    return undefined;
  }
  if (changes.title !== undefined) {
    article.title = changes.title;
  }
  if (changes.description !== undefined) {
    article.description = changes.description;
  }
  return article;
}
