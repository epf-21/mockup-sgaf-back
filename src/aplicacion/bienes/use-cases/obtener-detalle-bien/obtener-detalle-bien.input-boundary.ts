import type { ObtenerDetalleBienOutput } from './obtener-detalle-bien.output';

export abstract class ObtenerDetalleBienInputBoundary {
  abstract execute(id: string): Promise<ObtenerDetalleBienOutput>;
}
