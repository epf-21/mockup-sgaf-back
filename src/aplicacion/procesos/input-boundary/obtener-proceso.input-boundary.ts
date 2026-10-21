import type { ObtenerProcesoOutput } from '../output/obtener-proceso.output';

export abstract class ObtenerProcesoInputBoundary {
  abstract execute(id: string): Promise<ObtenerProcesoOutput>;
}
