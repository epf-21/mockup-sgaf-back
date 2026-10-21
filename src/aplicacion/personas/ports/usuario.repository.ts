import { ListarUsuariosOutput } from '../output/listar-usuarios.output';

export abstract class UsuarioRepository {
  abstract listar(): Promise<ListarUsuariosOutput[]>;
}
