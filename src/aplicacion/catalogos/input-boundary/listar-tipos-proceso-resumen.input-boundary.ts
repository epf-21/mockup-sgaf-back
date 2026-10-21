import type { ListarTiposProcesoResumenInput } from '../input/listar-tipos-proceso-resumen.input';
import type { ListarTiposProcesoResumenOutput } from '../output/listar-tipos-proceso-resumen.output';

export abstract class ListarTiposProcesoResumenInputBoundary {
  abstract execute(
    input: ListarTiposProcesoResumenInput,
  ): Promise<ListarTiposProcesoResumenOutput>;
}
