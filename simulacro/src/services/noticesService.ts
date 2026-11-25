import { randomUUID } from 'node:crypto';

// Representa el modelo completo de un aviso.
export interface Notice {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// Representa los campos opcionales que puede modificar una operación PATCH.
export interface NoticeChanges {
  title?: string;
  description?: string;
}

// Los avisos se guardan únicamente en memoria. Al reiniciar el servidor vuelven
// a aparecer los datos iniciales y desaparecen las modificaciones realizadas.
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

// Filtra por título y después calcula la página solicitada.
export function list(page: number, limit: number, search?: string) {
  // toLowerCase permite realizar una búsqueda sin distinguir mayúsculas.
  const filteredNotices = search
    ? notices.filter((notice) => notice.title.toLowerCase().includes(search.toLowerCase()))
    : notices;

  const start = (page - 1) * limit;

  return {
    data: filteredNotices.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: filteredNotices.length,
    },
  };
}

// Busca el aviso por su identificador.
export function getById(id: string): Notice | undefined {
  return notices.find((notice) => notice.id === id);
}

// Genera un aviso nuevo con UUID y fecha ISO actuales.
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

// Modifica únicamente los campos cuyo valor no sea undefined.
export function update(id: string, changes: NoticeChanges): Notice | undefined {
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
