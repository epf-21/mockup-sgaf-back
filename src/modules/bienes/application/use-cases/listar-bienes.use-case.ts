import type { BienRepositoryPort } from '../../domain/ports/bien-repository.port';

export class ListarBienesUseCase {
  constructor(private readonly repositorio: BienRepositoryPort) {}

  execute() {
    return this.repositorio.listarRaiz();
  }
}
