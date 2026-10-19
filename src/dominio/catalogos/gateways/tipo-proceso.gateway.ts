import type { TipoProcesoCatalogo } from '../tipos/tipo-proceso';

export abstract class TipoProcesoCatalogoGateway {
  abstract listar(categoria: string | null): Promise<TipoProcesoCatalogo[]>;
  abstract obtener(id: string): Promise<TipoProcesoCatalogo | null>;
}
