import type { PersonaRepositoryPort } from '../../../dominio/personas/puertos/persona-repository.port';

export class ListarPersonasUseCase {
  constructor(private readonly repositorio: PersonaRepositoryPort) {}

  execute() {
    return this.repositorio.listar();
  }
}
