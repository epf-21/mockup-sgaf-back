import type { TareaDetalle } from '../../../dominio/tareas/tipos/tarea';
import type { CerrarTareaInput } from './cerrar-tarea.input';

export abstract class CerrarTareaInputBoundary {
  abstract execute(input: CerrarTareaInput): Promise<TareaDetalle>;
}
