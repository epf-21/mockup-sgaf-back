import type { TipoProcesoCatalogoGateway } from '../../../dominio/catalogos/gateways/tipo-proceso.gateway';
import type { TipoProcesoCatalogo } from '../../../dominio/catalogos/tipos/tipo-proceso';
import type { ListarTiposProcesoInput } from './listar-tipos-proceso.input';
import type { ListarTiposProcesoInputBoundary } from './listar-tipos-proceso.input-boundary';

export class ListarTiposProcesoUseCase implements ListarTiposProcesoInputBoundary {
  constructor(private readonly tipos: TipoProcesoCatalogoGateway) {}

  execute(input: ListarTiposProcesoInput): Promise<TipoProcesoCatalogo[]> {
    return this.tipos.listar(input.categoria);
  }
}
