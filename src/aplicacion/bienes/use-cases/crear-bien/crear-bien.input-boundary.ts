import type { CrearBienOutput } from './crear-bien.output';
import type { CrearBienInput } from './crear-bien.input';

export abstract class CrearBienInputBoundary {
  abstract execute(input: CrearBienInput): Promise<CrearBienOutput>;
}
