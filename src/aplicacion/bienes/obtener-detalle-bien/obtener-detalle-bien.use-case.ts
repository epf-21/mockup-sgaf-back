import { BienNoEncontradoError } from '../../../dominio/bienes/errores/bien-no-encontrado.error';
import type { BienGateway } from '../../../dominio/bienes/gateways/bien.gateway';
import type { BienDetalle } from '../../../dominio/bienes/tipos/bien';
import type { ObtenerDetalleBienInputBoundary } from './obtener-detalle-bien.input-boundary';

export class ObtenerDetalleBienUseCase implements ObtenerDetalleBienInputBoundary {
  constructor(private readonly repositorio: BienGateway) {}

  async execute(id: string): Promise<BienDetalle> {
    const detalle = await this.repositorio.obtenerDetalle(id);
    if (!detalle) {
      throw new BienNoEncontradoError(id);
    }
    return detalle;
  }
}
