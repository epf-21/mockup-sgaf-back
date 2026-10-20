import type { TipoProcesoCatalogoRepository } from '../../ports/tipo-proceso.repository';
import type { ListarTiposProcesoOutput } from './listar-tipos-proceso.output';
import type { ListarTiposProcesoInput } from './listar-tipos-proceso.input';
import type { ListarTiposProcesoInputBoundary } from './listar-tipos-proceso.input-boundary';

export class ListarTiposProcesoUseCase implements ListarTiposProcesoInputBoundary {
  constructor(private readonly tipos: TipoProcesoCatalogoRepository) {}

  execute(input: ListarTiposProcesoInput): Promise<ListarTiposProcesoOutput> {
    return this.tipos.listar(input.categoria);
  }
}
