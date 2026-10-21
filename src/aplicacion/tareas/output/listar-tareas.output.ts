import type { PaginaOutput } from '../../comun/paginacion/paginacion.output';

export interface TareaResumenOutput {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  supervisores: number;
  procesos: number;
  estado: string;
}

export type ListarTareasOutput = PaginaOutput<TareaResumenOutput>;
