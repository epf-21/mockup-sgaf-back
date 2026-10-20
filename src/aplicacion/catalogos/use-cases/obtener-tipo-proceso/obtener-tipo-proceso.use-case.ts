import type { TipoProcesoCatalogoRepository } from '../../ports/tipo-proceso.repository';
import type { ObtenerTipoProcesoOutput } from './obtener-tipo-proceso.output';
import type { ObtenerTipoProcesoInputBoundary } from './obtener-tipo-proceso.input-boundary';

export class ObtenerTipoProcesoUseCase implements ObtenerTipoProcesoInputBoundary {
  constructor(private readonly tipos: TipoProcesoCatalogoRepository) {}

  execute(id: string): Promise<ObtenerTipoProcesoOutput> {
    return this.tipos.obtener(id);
  }
}
