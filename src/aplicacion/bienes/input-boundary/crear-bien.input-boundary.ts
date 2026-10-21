import type { CrearBienOutput } from '../output/crear-bien.output';
import type { CrearBienInput } from '../input/crear-bien.input';

export abstract class CrearBienInputBoundary {
  abstract execute(input: CrearBienInput): Promise<CrearBienOutput>;
}
