import type { BienDetalle } from '../../../dominio/bienes/tipos/bien';

export abstract class ObtenerDetalleBienInputBoundary {
  abstract execute(id: string): Promise<BienDetalle>;
}
