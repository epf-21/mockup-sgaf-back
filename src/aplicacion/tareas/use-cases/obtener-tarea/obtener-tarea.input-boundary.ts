import type { ObtenerTareaOutput } from './obtener-tarea.output';

export abstract class ObtenerTareaInputBoundary {
  abstract execute(id: string): Promise<ObtenerTareaOutput>;
}
