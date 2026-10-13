import type { CodificadorRepositoryPort } from '../../domain/ports/codificador-repository.port';

export class ListarCodificadoresResumenUseCase {
  constructor(private readonly repositorio: CodificadorRepositoryPort) {}

  execute() {
    return this.repositorio.listarResumen();
  }
}
