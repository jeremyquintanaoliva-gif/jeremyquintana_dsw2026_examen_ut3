
import { randomUUID } from 'node:crypto';

// Estructura de cada aviso
export interface Notice {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// Campos que se pueden modificar en un aviso
export interface NoticeChanges {
  title?: string;
  description?: string;
}

// Los avisos se guardan en memoria: al reiniciar el servidor se pierden los
// cambios y vuelve a estar disponible solamente la lista inicial.
const notices: Notice[] = [
  {
    id: 'aviso-1',
    title: 'Excursión de 2º DAW',
    description: 'La excursión será el próximo viernes.',
    createdAt: '2026-11-20T08:00:00.000Z',
  },
  {
    id: 'aviso-2',
    title: 'Examen de programación',
    description: 'El examen se realizará el lunes.',
    createdAt: '2026-11-21T08:00:00.000Z',
  },
  {
    id: 'aviso-3',
    title: 'Reunión de familias',
    description: 'La reunión tendrá lugar en el salón de actos.',
    createdAt: '2026-11-22T08:00:00.000Z',
  },
  {
    id: 'aviso-4',
    title: 'Cambio de horario',
    description: 'El horario del viernes será diferente.',
    createdAt: '2026-11-23T08:00:00.000Z',
  },
  {
    id: 'aviso-5',
    title: 'Examen de bases de datos',
    description: 'El examen será en el aula habitual.',
    createdAt: '2026-11-24T08:00:00.000Z',
  },
];

// Convierte los parámetros de página en el rango que necesita Array.slice.
// Ejemplo: página 2 y límite 10 empieza en el índice 10.
export function list(page: number, limit: number) {
  const start = (page - 1) * limit;

  return {
    data: notices.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: notices.length,
    },
  };
}

// Obtener aviso por ID
export function getById(id: string): Notice | undefined {
  return notices.find((notice) => notice.id === id);
}

// Crear aviso
export function create(title: string, description: string): Notice {
  const notice: Notice = {
    id: randomUUID(),
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  notices.push(notice);

  return notice;
}

// Modificar aviso
export function update(
  id: string,
  changes: NoticeChanges,
): Notice | undefined {
  const notice = getById(id);

  if (!notice) {
    return undefined;
  }

  if (changes.title !== undefined) {
    notice.title = changes.title;
  }

  if (changes.description !== undefined) {
    notice.description = changes.description;
  }

  return notice;
}
