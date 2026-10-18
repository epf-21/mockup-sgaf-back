import { NotFoundError } from '../../comun/errores/not-found.error';

export class TipoProcesoNoEncontradoError extends NotFoundError {
  constructor(id: string) {
    super(`Tipo de proceso no encontrado: ${id}`);
  }
}
