import type { PersonaRepositoryPort } from '../../domain/ports/persona-repository.port';

export class ListarPersonasUseCase {
  constructor(private readonly repositorio: PersonaRepositoryPort) {}

  execute() {
    return this.repositorio.listar();
  }
}
