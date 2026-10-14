import { NotFoundError } from '../../comun/errores/not-found.error';

export class BienNoEncontradoError extends NotFoundError {
  constructor(id: string) {
    super(`Bien no encontrado: ${id}`);
  }
}
