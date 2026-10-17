import type {
  Paginacion,
  PaginaTareaResumen,
} from '../../../dominio/tareas/tipos/tarea';

export abstract class ListarTareasInputBoundary {
  abstract execute(paginacion: Paginacion): Promise<PaginaTareaResumen>;
}
