import type { BienGateway } from '../../../dominio/bienes/gateways/bien.gateway';
import type {
  Paginacion,
  PaginaBienResumen,
} from '../../../dominio/bienes/tipos/bien';
import type { ListarBienesInputBoundary } from './listar-bienes.input-boundary';

export class ListarBienesUseCase implements ListarBienesInputBoundary {
  constructor(private readonly repositorio: BienGateway) {}

  execute(paginacion: Paginacion): Promise<PaginaBienResumen> {
    return this.repositorio.listarPaginado(paginacion);
  }
}
