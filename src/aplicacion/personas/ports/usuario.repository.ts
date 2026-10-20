import { ListarUsuariosOutput } from '../use-cases/listar-usuarios/listar-usuarios.output';

export abstract class UsuarioRepository {
  abstract listar(): Promise<ListarUsuariosOutput[]>;
}
