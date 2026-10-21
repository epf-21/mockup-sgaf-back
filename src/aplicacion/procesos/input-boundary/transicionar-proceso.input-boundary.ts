import type { TransicionarProcesoOutput } from '../output/transicionar-proceso.output';
import type { TransicionarProcesoInput } from '../input/transicionar-proceso.input';

export abstract class TransicionarProcesoInputBoundary {
  abstract execute(
    input: TransicionarProcesoInput,
  ): Promise<TransicionarProcesoOutput>;
}
