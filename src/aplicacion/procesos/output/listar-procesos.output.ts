import type { PaginaOutput } from '../../comun/paginacion/paginacion.output';

export interface ProcesoResumenOutput {
  id: string;
  codigo: string;
  tipo: {
    codigo: string;
    nombre: string;
  };
  destino: string | null;
  estado: string;
}

export type ListarProcesosOutput = PaginaOutput<ProcesoResumenOutput>;
