import type { Paginacion } from '../../../comun/paginacion/paginacion';
import type { ListarBienesOutput } from './listar-bienes.output';

export abstract class ListarBienesInputBoundary {
  abstract execute(paginacion: Paginacion): Promise<ListarBienesOutput>;
}
