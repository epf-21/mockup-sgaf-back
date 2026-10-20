import type { ListarTiposProcesoOutput } from './listar-tipos-proceso.output';
import type { ListarTiposProcesoInput } from './listar-tipos-proceso.input';

export abstract class ListarTiposProcesoInputBoundary {
  abstract execute(
    input: ListarTiposProcesoInput,
  ): Promise<ListarTiposProcesoOutput>;
}
