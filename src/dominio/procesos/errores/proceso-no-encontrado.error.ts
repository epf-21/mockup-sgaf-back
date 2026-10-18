import { NotFoundError } from '../../comun/errores/not-found.error';

export class ProcesoNoEncontradoError extends NotFoundError {
  constructor(id: string) {
    super(`Proceso no encontrado: ${id}`);
  }
}
