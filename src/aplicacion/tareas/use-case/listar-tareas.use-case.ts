import type { TareaRepository } from '../ports/tarea.repository';
import type { Paginacion } from '../../comun/paginacion/paginacion';
import type { ListarTareasOutput } from '../output/listar-tareas.output';
import type { ListarTareasInputBoundary } from '../input-boundary/listar-tareas.input-boundary';

export class ListarTareasUseCase implements ListarTareasInputBoundary {
  constructor(private readonly tareas: TareaRepository) {}

  execute(paginacion: Paginacion): Promise<ListarTareasOutput> {
    return this.tareas.listarPaginado(paginacion);
  }
}
