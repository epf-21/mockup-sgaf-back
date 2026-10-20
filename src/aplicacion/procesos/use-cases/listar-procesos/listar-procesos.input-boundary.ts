import type { Paginacion } from '../../../comun/paginacion/paginacion';
import type { ListarProcesosOutput } from './listar-procesos.output';

export abstract class ListarProcesosInputBoundary {
  abstract execute(paginacion: Paginacion): Promise<ListarProcesosOutput>;
}
