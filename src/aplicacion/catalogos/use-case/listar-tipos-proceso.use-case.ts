import type { TipoProcesoCatalogoRepository } from '../ports/tipo-proceso.repository';
import type { ListarTiposProcesoOutput } from '../output/listar-tipos-proceso.output';
import type { ListarTiposProcesoInput } from '../input/listar-tipos-proceso.input';
import type { ListarTiposProcesoInputBoundary } from '../input-boundary/listar-tipos-proceso.input-boundary';

export class ListarTiposProcesoUseCase implements ListarTiposProcesoInputBoundary {
  constructor(private readonly tipos: TipoProcesoCatalogoRepository) {}

  execute(input: ListarTiposProcesoInput): Promise<ListarTiposProcesoOutput> {
    return this.tipos.listar(input.categoria);
  }
}
