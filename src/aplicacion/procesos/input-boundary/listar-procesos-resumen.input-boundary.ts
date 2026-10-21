import type { Paginacion } from '../../comun/paginacion/paginacion';
import type { ListarProcesosResumenOutput } from '../output/listar-procesos-resumen.output';

export abstract class ListarProcesosResumenInputBoundary {
  abstract execute(
    paginacion: Paginacion,
  ): Promise<ListarProcesosResumenOutput>;
}
