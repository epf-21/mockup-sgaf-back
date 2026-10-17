import type { TareaDetalle } from '../../../dominio/tareas/tipos/tarea';

export abstract class ObtenerTareaInputBoundary {
  abstract execute(id: string): Promise<TareaDetalle>;
}
