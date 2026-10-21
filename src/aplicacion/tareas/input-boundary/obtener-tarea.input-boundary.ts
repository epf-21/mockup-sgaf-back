import type { ObtenerTareaOutput } from '../output/obtener-tarea.output';

export abstract class ObtenerTareaInputBoundary {
  abstract execute(id: string): Promise<ObtenerTareaOutput>;
}
