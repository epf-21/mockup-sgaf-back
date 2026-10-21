import type { CerrarTareaOutput } from '../output/cerrar-tarea.output';
import type { CerrarTareaInput } from '../input/cerrar-tarea.input';

export abstract class CerrarTareaInputBoundary {
  abstract execute(input: CerrarTareaInput): Promise<CerrarTareaOutput>;
}
