import type { TipoProcesoCatalogoOutput } from '../output/listar-tipos-proceso.output';
import type { TipoProcesoResumenOutput } from '../output/listar-tipos-proceso-resumen.output';

export abstract class TipoProcesoCatalogoRepository {
  abstract listar(
    categoria: string | null,
  ): Promise<TipoProcesoCatalogoOutput[]>;
  abstract listarResumen(
    categoria: string | null,
  ): Promise<TipoProcesoResumenOutput[]>;
  abstract obtener(id: string): Promise<TipoProcesoCatalogoOutput | null>;
}
