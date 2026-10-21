import { TareaNoEncontradaError } from '../../../dominio/tareas/errores/tarea-no-encontrada.error';
import type { TareaRepository } from '../ports/tarea.repository';
import type { ObtenerTareaOutput } from '../output/obtener-tarea.output';
import type { ObtenerTareaInputBoundary } from '../input-boundary/obtener-tarea.input-boundary';

export class ObtenerTareaUseCase implements ObtenerTareaInputBoundary {
  constructor(private readonly tareas: TareaRepository) {}

  async execute(id: string): Promise<ObtenerTareaOutput> {
    const detalle = await this.tareas.obtenerDetalle(id);
    if (!detalle) {
      throw new TareaNoEncontradaError(id);
    }
    return detalle;
  }
}
