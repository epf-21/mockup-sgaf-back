import type { ObtenerTipoProcesoOutput } from './obtener-tipo-proceso.output';

export abstract class ObtenerTipoProcesoInputBoundary {
  abstract execute(id: string): Promise<ObtenerTipoProcesoOutput>;
}
