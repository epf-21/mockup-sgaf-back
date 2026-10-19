import type { ProcesoDetalle } from '../../../dominio/procesos/tipos/proceso';
import type { CompletarMovimientoInput } from './completar-movimiento.input';

export abstract class CompletarMovimientoInputBoundary {
  abstract execute(input: CompletarMovimientoInput): Promise<ProcesoDetalle>;
}
