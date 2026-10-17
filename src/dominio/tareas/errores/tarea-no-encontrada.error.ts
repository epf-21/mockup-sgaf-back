import { NotFoundError } from '../../comun/errores/not-found.error';

export class TareaNoEncontradaError extends NotFoundError {
  constructor(id: string) {
    super(`Tarea no encontrada: ${id}`);
  }
}
