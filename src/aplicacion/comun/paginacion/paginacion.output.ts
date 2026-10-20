export interface PaginaOutput<T> {
  datos: T[];
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
  siguiente: number | null;
  anterior: number | null;
}
