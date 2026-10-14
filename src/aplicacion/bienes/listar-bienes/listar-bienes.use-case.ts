import type { BienRepositoryPort } from '../../../dominio/bienes/puertos/bien-repository.port';
import type { Paginacion } from '../../../dominio/bienes/tipos/bien';

export class ListarBienesUseCase {
  constructor(private readonly repositorio: BienRepositoryPort) {}

  execute(paginacion: Paginacion) {
    return this.repositorio.listarPaginado(paginacion);
  }
}
