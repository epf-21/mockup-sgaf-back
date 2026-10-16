import type {
  Paginacion,
  PaginaBienResumen,
} from '../../../dominio/bienes/tipos/bien';

export abstract class ListarBienesInputBoundary {
  abstract execute(paginacion: Paginacion): Promise<PaginaBienResumen>;
}
