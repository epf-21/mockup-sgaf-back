import type { TipoProcesoCatalogo } from '../../../dominio/catalogos/tipos/tipo-proceso';

export abstract class ObtenerTipoProcesoInputBoundary {
  abstract execute(id: string): Promise<TipoProcesoCatalogo | null>;
}
