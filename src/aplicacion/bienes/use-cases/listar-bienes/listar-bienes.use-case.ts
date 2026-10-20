import type { BienRepository } from '../../ports/bien.repository';
import type { Paginacion } from '../../../comun/paginacion/paginacion';
import type { ListarBienesOutput } from './listar-bienes.output';
import type { ListarBienesInputBoundary } from './listar-bienes.input-boundary';

export class ListarBienesUseCase implements ListarBienesInputBoundary {
  constructor(private readonly repositorio: BienRepository) {}

  execute(paginacion: Paginacion): Promise<ListarBienesOutput> {
    return this.repositorio.listarPaginado(paginacion);
  }
}
