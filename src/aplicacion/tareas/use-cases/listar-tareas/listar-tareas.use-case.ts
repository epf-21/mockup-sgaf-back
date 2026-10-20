import type { TareaRepository } from '../../ports/tarea.repository';
import type { Paginacion } from '../../../../dominio/tareas/tipos/tarea';
import type { ListarTareasOutput } from './listar-tareas.output';
import type { ListarTareasInputBoundary } from './listar-tareas.input-boundary';

export class ListarTareasUseCase implements ListarTareasInputBoundary {
  constructor(private readonly tareas: TareaRepository) {}

  execute(paginacion: Paginacion): Promise<ListarTareasOutput> {
    return this.tareas.listarPaginado(paginacion);
  }
}
