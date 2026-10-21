import type { CompletarMovimientoOutput } from '../output/completar-movimiento.output';
import type { CompletarMovimientoInput } from '../input/completar-movimiento.input';

export abstract class CompletarMovimientoInputBoundary {
  abstract execute(
    input: CompletarMovimientoInput,
  ): Promise<CompletarMovimientoOutput>;
}
