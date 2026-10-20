import type { CrearTareaOutput } from './crear-tarea.output';
import type { CrearTareaInput } from './crear-tarea.input';

export abstract class CrearTareaInputBoundary {
  abstract execute(input: CrearTareaInput): Promise<CrearTareaOutput>;
}
