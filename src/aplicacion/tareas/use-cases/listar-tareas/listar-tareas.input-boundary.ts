import type { Paginacion } from '../../../../dominio/tareas/tipos/tarea';
import type { ListarTareasOutput } from './listar-tareas.output';

export abstract class ListarTareasInputBoundary {
  abstract execute(paginacion: Paginacion): Promise<ListarTareasOutput>;
}
