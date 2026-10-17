import type { TareaGateway } from '../../../dominio/tareas/gateways/tarea.gateway';
import type {
  Paginacion,
  PaginaTareaResumen,
} from '../../../dominio/tareas/tipos/tarea';
import type { ListarTareasInputBoundary } from './listar-tareas.input-boundary';

export class ListarTareasUseCase implements ListarTareasInputBoundary {
  constructor(private readonly tareas: TareaGateway) {}

  execute(paginacion: Paginacion): Promise<PaginaTareaResumen> {
    return this.tareas.listarPaginado(paginacion);
  }
}
