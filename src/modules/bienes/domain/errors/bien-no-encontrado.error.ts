import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';

export class BienNoEncontradoError extends NotFoundError {
  constructor(id: string) {
    super(`Bien no encontrado: ${id}`);
  }
}
