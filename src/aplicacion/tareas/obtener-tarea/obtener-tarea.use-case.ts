import { TareaNoEncontradaError } from '../../../dominio/tareas/errores/tarea-no-encontrada.error';
import type { TareaGateway } from '../../../dominio/tareas/gateways/tarea.gateway';
import type { TareaDetalle } from '../../../dominio/tareas/tipos/tarea';
import type { ObtenerTareaInputBoundary } from './obtener-tarea.input-boundary';

export class ObtenerTareaUseCase implements ObtenerTareaInputBoundary {
  constructor(private readonly tareas: TareaGateway) {}

  async execute(id: string): Promise<TareaDetalle> {
    const detalle = await this.tareas.obtenerDetalle(id);
    if (!detalle) {
      throw new TareaNoEncontradaError(id);
    }
    return detalle;
  }
}
