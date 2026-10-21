import type { ObtenerTipoProcesoOutput } from '../output/obtener-tipo-proceso.output';

export abstract class ObtenerTipoProcesoInputBoundary {
  abstract execute(id: string): Promise<ObtenerTipoProcesoOutput>;
}
