import type { UsuarioGateway } from '../../../dominio/personas/gateways/usuario.gateway';
import type { ListarUsuariosInputBoundary } from './listar-usuarios.input-boundary';

export class ListarUsuariosUseCase implements ListarUsuariosInputBoundary {
  constructor(private readonly repositorio: UsuarioGateway) {}

  execute() {
    return this.repositorio.listarActivosGestion();
  }
}
