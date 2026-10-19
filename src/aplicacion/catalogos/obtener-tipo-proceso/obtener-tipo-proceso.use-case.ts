import type { TipoProcesoCatalogoGateway } from '../../../dominio/catalogos/gateways/tipo-proceso.gateway';
import type { TipoProcesoCatalogo } from '../../../dominio/catalogos/tipos/tipo-proceso';
import type { ObtenerTipoProcesoInputBoundary } from './obtener-tipo-proceso.input-boundary';

export class ObtenerTipoProcesoUseCase implements ObtenerTipoProcesoInputBoundary {
  constructor(private readonly tipos: TipoProcesoCatalogoGateway) {}

  execute(id: string): Promise<TipoProcesoCatalogo | null> {
    return this.tipos.obtener(id);
  }
}
