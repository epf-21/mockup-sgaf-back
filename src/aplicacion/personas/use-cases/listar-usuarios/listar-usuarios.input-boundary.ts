import type { ListarUsuariosOutput } from './listar-usuarios.output';

export abstract class ListarUsuariosInputBoundary {
  abstract execute(): Promise<ListarUsuariosOutput[]>;
}
