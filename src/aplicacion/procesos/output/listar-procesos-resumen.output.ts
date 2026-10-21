import type { PaginaOutput } from '../../comun/paginacion/paginacion.output';

export interface ProcesoResumenDetalladoOutput {
  id: string;
  codigo: string;
  tipo: {
    codigo: string;
    nombre: string;
  };
  bienes: number;
  movimientos: number;
  estado: string;
  requiere_autorizacion: boolean;
}

export type ListarProcesosResumenOutput =
  PaginaOutput<ProcesoResumenDetalladoOutput>;
