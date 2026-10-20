import type { PaginaOutput } from './paginacion.output';

export interface Paginacion {
  pagina: number;
  porPagina: number;
}

const PAGINA_DEFAULT = 1;
const POR_PAGINA_DEFAULT = 10;

export function normalizarPaginacion(
  paginacion: Partial<Paginacion>,
): Paginacion {
  return {
    pagina: paginacion.pagina ?? PAGINA_DEFAULT,
    porPagina: paginacion.porPagina ?? POR_PAGINA_DEFAULT,
  };
}

export function calcularOffset(paginacion: Paginacion): number {
  return (paginacion.pagina - 1) * paginacion.porPagina;
}

export function crearPaginaOutput<T>(
  datos: T[],
  total: number,
  paginacion: Paginacion,
): PaginaOutput<T> {
  const totalPaginas = Math.max(1, Math.ceil(total / paginacion.porPagina));

  return {
    datos,
    total,
    pagina: paginacion.pagina,
    por_pagina: paginacion.porPagina,
    total_paginas: totalPaginas,
    siguiente: paginacion.pagina < totalPaginas ? paginacion.pagina + 1 : null,
    anterior:
      paginacion.pagina > 1
        ? Math.min(paginacion.pagina - 1, totalPaginas)
        : null,
  };
}
