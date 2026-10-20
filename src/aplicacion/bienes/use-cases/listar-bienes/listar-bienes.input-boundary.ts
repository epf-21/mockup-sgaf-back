import type { Paginacion } from '../../../../dominio/bienes/tipos/bien';
import type { ListarBienesOutput } from './listar-bienes.output';

export abstract class ListarBienesInputBoundary {
  abstract execute(paginacion: Paginacion): Promise<ListarBienesOutput>;
}
