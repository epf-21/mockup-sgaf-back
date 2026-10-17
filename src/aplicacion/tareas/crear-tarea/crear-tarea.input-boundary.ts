import type { TareaCreada } from '../../../dominio/tareas/tipos/tarea';
import type { CrearTareaInput } from './crear-tarea.input';

export abstract class CrearTareaInputBoundary {
  abstract execute(input: CrearTareaInput): Promise<TareaCreada>;
}
