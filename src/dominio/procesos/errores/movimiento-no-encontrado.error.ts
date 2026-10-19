import { NotFoundError } from '../../comun/errores/not-found.error';

export class MovimientoNoEncontradoError extends NotFoundError {
  constructor(id: string) {
    super(`Movimiento no encontrado: ${id}`);
  }
}
