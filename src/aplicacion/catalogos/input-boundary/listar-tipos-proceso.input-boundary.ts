import type { ListarTiposProcesoOutput } from '../output/listar-tipos-proceso.output';
import type { ListarTiposProcesoInput } from '../input/listar-tipos-proceso.input';

export abstract class ListarTiposProcesoInputBoundary {
  abstract execute(
    input: ListarTiposProcesoInput,
  ): Promise<ListarTiposProcesoOutput>;
}
