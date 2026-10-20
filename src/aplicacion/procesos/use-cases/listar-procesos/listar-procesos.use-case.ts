import type { ProcesoRepository } from '../../ports/proceso.repository';
import type { PaginacionProcesos } from '../../../../dominio/procesos/tipos/proceso';
import type { ListarProcesosOutput } from './listar-procesos.output';
import type { ListarProcesosInputBoundary } from './listar-procesos.input-boundary';

export class ListarProcesosUseCase implements ListarProcesosInputBoundary {
  constructor(private readonly procesos: ProcesoRepository) {}

  execute(paginacion: PaginacionProcesos): Promise<ListarProcesosOutput> {
    return this.procesos.listarPaginado(paginacion);
  }
}
