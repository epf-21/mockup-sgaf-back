import { NotFoundError } from '../../comun/errores/not-found.error';

export class UsuarioNoEncontradoError extends NotFoundError {
  constructor(id: string) {
    super(`Usuario no encontrado: ${id}`);
  }
}
