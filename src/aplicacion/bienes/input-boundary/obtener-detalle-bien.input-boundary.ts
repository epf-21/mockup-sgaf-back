import type { ObtenerDetalleBienOutput } from '../output/obtener-detalle-bien.output';

export abstract class ObtenerDetalleBienInputBoundary {
  abstract execute(id: string): Promise<ObtenerDetalleBienOutput>;
}
