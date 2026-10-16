import type { UsuarioResumen } from '../../../dominio/personas/gateways/usuario.gateway';

export abstract class ListarUsuariosInputBoundary {
  abstract execute(): Promise<UsuarioResumen[]>;
}
