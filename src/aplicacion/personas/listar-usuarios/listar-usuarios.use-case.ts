import type { UsuarioRepositoryPort } from '../../../dominio/personas/puertos/usuario-repository.port';

export class ListarUsuariosUseCase {
  constructor(private readonly repositorio: UsuarioRepositoryPort) {}

  execute() {
    return this.repositorio.listarActivosGestion();
  }
}
