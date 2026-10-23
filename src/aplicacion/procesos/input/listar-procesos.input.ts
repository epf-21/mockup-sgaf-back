import type { Paginacion } from '../../comun/paginacion/paginacion';

export interface ListarProcesosInput {
  paginacion: Paginacion;
  categoria: string | null;
  tipoProcesoId: string | null;
  estado: string | null;
  unidadDestinoId: string | null;
}
