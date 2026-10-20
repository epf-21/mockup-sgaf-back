import type { PaginacionProcesos } from '../../../../dominio/procesos/tipos/proceso';
import type { ListarProcesosOutput } from './listar-procesos.output';

export abstract class ListarProcesosInputBoundary {
  abstract execute(
    paginacion: PaginacionProcesos,
  ): Promise<ListarProcesosOutput>;
}
