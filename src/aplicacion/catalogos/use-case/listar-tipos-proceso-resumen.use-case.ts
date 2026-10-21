import type { TipoProcesoCatalogoRepository } from '../ports/tipo-proceso.repository';
import type { ListarTiposProcesoResumenInput } from '../input/listar-tipos-proceso-resumen.input';
import type { ListarTiposProcesoResumenOutput } from '../output/listar-tipos-proceso-resumen.output';
import type { ListarTiposProcesoResumenInputBoundary } from '../input-boundary/listar-tipos-proceso-resumen.input-boundary';

export class ListarTiposProcesoResumenUseCase implements ListarTiposProcesoResumenInputBoundary {
  constructor(private readonly tipos: TipoProcesoCatalogoRepository) {}

  execute(
    input: ListarTiposProcesoResumenInput,
  ): Promise<ListarTiposProcesoResumenOutput> {
    return this.tipos.listarResumen(input.categoria);
  }
}
