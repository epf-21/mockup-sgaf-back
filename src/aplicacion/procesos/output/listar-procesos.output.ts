import type { PaginaOutput } from '../../comun/paginacion/paginacion.output';

export interface ProcesoResumenOutput {
  id: string;
  codigo: string;
  tipo: {
    codigo: string;
    nombre: string;
  };
  unidad_origen: string | null;
  unidad_destino: string | null;
  bienes: number;
  estado: string;
}

export type ListarProcesosOutput = PaginaOutput<ProcesoResumenOutput>;
