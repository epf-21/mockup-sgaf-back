import { BienNoEncontradoError } from '../../../dominio/bienes/errores/bien-no-encontrado.error';
import type { BienRepositoryPort } from '../../../dominio/bienes/puertos/bien-repository.port';

export class ObtenerDetalleBienUseCase {
  constructor(private readonly repositorio: BienRepositoryPort) {}

  async execute(id: string) {
    const detalle = await this.repositorio.obtenerDetalle(id);
    if (!detalle) {
      throw new BienNoEncontradoError(id);
    }
    return detalle;
  }
}
