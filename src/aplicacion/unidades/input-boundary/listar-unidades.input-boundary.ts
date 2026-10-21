import type { ListarUnidadesOutput } from '../output/listar-unidades.output';

export abstract class ListarUnidadesInputBoundary {
  abstract execute(): Promise<ListarUnidadesOutput[]>;
}
