import type { BienRepositoryPort } from '../../domain/ports/bien-repository.port';
import type { Paginacion } from '../../domain/tipos/bien';

export class ListarBienesUseCase {
  constructor(private readonly repositorio: BienRepositoryPort) {}

  execute(paginacion: Paginacion) {
    return this.repositorio.listarPaginado(paginacion);
  }
}
