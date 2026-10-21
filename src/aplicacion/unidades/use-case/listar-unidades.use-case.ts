import type { UnidadRepository } from '../ports/unidad.repository';
import type { ListarUnidadesOutput } from '../output/listar-unidades.output';
import type { ListarUnidadesInputBoundary } from '../input-boundary/listar-unidades.input-boundary';

export class ListarUnidadesUseCase implements ListarUnidadesInputBoundary {
  constructor(private readonly repositorio: UnidadRepository) {}

  execute(): Promise<ListarUnidadesOutput[]> {
    return this.repositorio.listar();
  }
}
