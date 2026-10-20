export interface TareaResumenOutput {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  supervisores: number;
  procesos: number;
  estado: string;
}

export interface ListarTareasOutput {
  datos: TareaResumenOutput[];
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
  siguiente: number | null;
  anterior: number | null;
}
