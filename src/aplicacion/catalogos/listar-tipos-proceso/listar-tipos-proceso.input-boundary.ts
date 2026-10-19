import type { TipoProcesoCatalogo } from '../../../dominio/catalogos/tipos/tipo-proceso';
import type { ListarTiposProcesoInput } from './listar-tipos-proceso.input';

export abstract class ListarTiposProcesoInputBoundary {
  abstract execute(
    input: ListarTiposProcesoInput,
  ): Promise<TipoProcesoCatalogo[]>;
}
