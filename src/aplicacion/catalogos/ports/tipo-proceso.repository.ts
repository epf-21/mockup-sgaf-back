import type { TipoProcesoCatalogoOutput } from '../use-cases/listar-tipos-proceso/listar-tipos-proceso.output';

export abstract class TipoProcesoCatalogoRepository {
  abstract listar(
    categoria: string | null,
  ): Promise<TipoProcesoCatalogoOutput[]>;
  abstract obtener(id: string): Promise<TipoProcesoCatalogoOutput | null>;
}
