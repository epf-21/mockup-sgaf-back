import { ProcesoNoEncontradoError } from '../../../dominio/procesos/errores/proceso-no-encontrado.error';
import type { ProcesoGateway } from '../../../dominio/procesos/gateways/proceso.gateway';
import type { ProcesoDetalle } from '../../../dominio/procesos/tipos/proceso';
import type { ObtenerProcesoInputBoundary } from './obtener-proceso.input-boundary';

export class ObtenerProcesoUseCase implements ObtenerProcesoInputBoundary {
  constructor(private readonly procesos: ProcesoGateway) {}

  async execute(id: string): Promise<ProcesoDetalle> {
    const detalle = await this.procesos.obtenerDetalle(id);
    if (!detalle) {
      throw new ProcesoNoEncontradoError(id);
    }
    return detalle;
  }
}
