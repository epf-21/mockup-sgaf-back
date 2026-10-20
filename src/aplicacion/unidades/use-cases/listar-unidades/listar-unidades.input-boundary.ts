import type { ListarUnidadesOutput } from './listar-unidades.output';

export abstract class ListarUnidadesInputBoundary {
  abstract execute(): Promise<ListarUnidadesOutput[]>;
}
