import type { BienRepositoryPort } from '../../domain/ports/bien-repository.port';
import type { FiltrosBienes, Paginacion } from '../../domain/tipos/bien';

export class ListarBienesUseCase {
  constructor(private readonly repositorio: BienRepositoryPort) {}

  execute(filtros: FiltrosBienes, paginacion: Paginacion) {
    return this.repositorio.listarPaginado(filtros, paginacion);
  }
}
