import type { CompletarMovimientoOutput } from './completar-movimiento.output';
import type { CompletarMovimientoInput } from './completar-movimiento.input';

export abstract class CompletarMovimientoInputBoundary {
  abstract execute(
    input: CompletarMovimientoInput,
  ): Promise<CompletarMovimientoOutput>;
}
