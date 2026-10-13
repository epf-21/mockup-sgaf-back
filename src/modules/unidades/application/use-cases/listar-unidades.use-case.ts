import type { UnidadRepositoryPort } from '../../domain/ports/unidad-repository.port';

export class ListarUnidadesUseCase {
  constructor(private readonly repositorio: UnidadRepositoryPort) {}

  execute() {
    return this.repositorio.listar();
  }
}
