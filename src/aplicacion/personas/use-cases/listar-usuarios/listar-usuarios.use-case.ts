import type { UsuarioRepository } from '../../ports/usuario.repository';
import type { ListarUsuariosOutput } from './listar-usuarios.output';
import type { ListarUsuariosInputBoundary } from './listar-usuarios.input-boundary';

export class ListarUsuariosUseCase implements ListarUsuariosInputBoundary {
  constructor(private readonly repositorio: UsuarioRepository) {}

  execute(): Promise<ListarUsuariosOutput> {
    return this.repositorio.listarActivosGestion();
  }
}
