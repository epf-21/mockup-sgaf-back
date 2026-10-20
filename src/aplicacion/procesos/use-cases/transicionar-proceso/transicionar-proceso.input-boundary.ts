import type { TransicionarProcesoOutput } from './transicionar-proceso.output';
import type { TransicionarProcesoInput } from './transicionar-proceso.input';

export abstract class TransicionarProcesoInputBoundary {
  abstract execute(
    input: TransicionarProcesoInput,
  ): Promise<TransicionarProcesoOutput>;
}
