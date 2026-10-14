import type { UnidadRepositoryPort } from '../../../dominio/unidades/puertos/unidad-repository.port';

export class ListarUnidadesUseCase {
  constructor(private readonly repositorio: UnidadRepositoryPort) {}

  execute() {
    return this.repositorio.listar();
  }
}
