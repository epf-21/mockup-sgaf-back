import type { ListarUsuariosOutput } from '../output/listar-usuarios.output';

export abstract class ListarUsuariosInputBoundary {
  abstract execute(): Promise<ListarUsuariosOutput[]>;
}
