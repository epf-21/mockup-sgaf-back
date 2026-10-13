import type { UsuarioRepositoryPort } from '../../domain/ports/usuario-repository.port';

export class ListarUsuariosUseCase {
  constructor(private readonly repositorio: UsuarioRepositoryPort) {}

  execute() {
    return this.repositorio.listarActivosGestion();
  }
}
