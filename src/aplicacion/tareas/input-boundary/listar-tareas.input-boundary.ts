import type { Paginacion } from '../../comun/paginacion/paginacion';
import type { ListarTareasOutput } from '../output/listar-tareas.output';

export abstract class ListarTareasInputBoundary {
  abstract execute(paginacion: Paginacion): Promise<ListarTareasOutput>;
}
