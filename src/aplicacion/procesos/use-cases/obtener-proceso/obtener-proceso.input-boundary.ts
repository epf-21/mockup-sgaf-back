import type { ObtenerProcesoOutput } from './obtener-proceso.output';

export abstract class ObtenerProcesoInputBoundary {
  abstract execute(id: string): Promise<ObtenerProcesoOutput>;
}
