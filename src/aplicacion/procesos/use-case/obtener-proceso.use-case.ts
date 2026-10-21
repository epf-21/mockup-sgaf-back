import { ProcesoNoEncontradoError } from '../../../dominio/procesos/errores/proceso-no-encontrado.error';
import type { ProcesoRepository } from '../ports/proceso.repository';
import type { ObtenerProcesoOutput } from '../output/obtener-proceso.output';
import type { ObtenerProcesoInputBoundary } from '../input-boundary/obtener-proceso.input-boundary';

export class ObtenerProcesoUseCase implements ObtenerProcesoInputBoundary {
  constructor(private readonly procesos: ProcesoRepository) {}

  async execute(id: string): Promise<ObtenerProcesoOutput> {
    const detalle = await this.procesos.obtenerDetalle(id);
    if (!detalle) {
      throw new ProcesoNoEncontradoError(id);
    }
    return detalle;
  }
}
