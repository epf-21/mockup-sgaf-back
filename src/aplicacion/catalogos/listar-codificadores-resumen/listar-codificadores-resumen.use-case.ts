import type { CodificadorRepositoryPort } from '../../../dominio/catalogos/puertos/codificador-repository.port';

export class ListarCodificadoresResumenUseCase {
  constructor(private readonly repositorio: CodificadorRepositoryPort) {}

  execute() {
    return this.repositorio.listarResumen();
  }
}
