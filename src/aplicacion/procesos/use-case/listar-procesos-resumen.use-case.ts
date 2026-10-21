import type { ProcesoRepository } from '../ports/proceso.repository';
import type { Paginacion } from '../../comun/paginacion/paginacion';
import type { ListarProcesosResumenOutput } from '../output/listar-procesos-resumen.output';
import type { ListarProcesosResumenInputBoundary } from '../input-boundary/listar-procesos-resumen.input-boundary';

export class ListarProcesosResumenUseCase implements ListarProcesosResumenInputBoundary {
  constructor(private readonly procesos: ProcesoRepository) {}

  execute(paginacion: Paginacion): Promise<ListarProcesosResumenOutput> {
    return this.procesos.listarResumen(paginacion);
  }
}
