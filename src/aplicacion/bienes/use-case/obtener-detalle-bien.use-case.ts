import { BienNoEncontradoError } from '../../../dominio/bienes/errores/bien-no-encontrado.error';
import type { BienRepository } from '../ports/bien.repository';
import type { ObtenerDetalleBienOutput } from '../output/obtener-detalle-bien.output';
import type { ObtenerDetalleBienInputBoundary } from '../input-boundary/obtener-detalle-bien.input-boundary';

export class ObtenerDetalleBienUseCase implements ObtenerDetalleBienInputBoundary {
  constructor(private readonly repositorio: BienRepository) {}

  async execute(id: string): Promise<ObtenerDetalleBienOutput> {
    const detalle = await this.repositorio.obtenerDetalle(id);
    if (!detalle) {
      throw new BienNoEncontradoError(id);
    }
    return detalle;
  }
}
