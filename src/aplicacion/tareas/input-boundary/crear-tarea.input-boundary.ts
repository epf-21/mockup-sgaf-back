import type { CrearTareaOutput } from '../output/crear-tarea.output';
import type { CrearTareaInput } from '../input/crear-tarea.input';

export abstract class CrearTareaInputBoundary {
  abstract execute(input: CrearTareaInput): Promise<CrearTareaOutput>;
}
