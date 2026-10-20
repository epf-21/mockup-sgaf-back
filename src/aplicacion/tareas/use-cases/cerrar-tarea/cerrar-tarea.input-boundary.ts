import type { CerrarTareaOutput } from './cerrar-tarea.output';
import type { CerrarTareaInput } from './cerrar-tarea.input';

export abstract class CerrarTareaInputBoundary {
  abstract execute(input: CerrarTareaInput): Promise<CerrarTareaOutput>;
}
