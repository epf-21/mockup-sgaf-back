import type { CrearProcesoOutput } from '../output/crear-proceso.output';
import type { CrearProcesoInput } from '../input/crear-proceso.input';

export abstract class CrearProcesoInputBoundary {
  abstract execute(input: CrearProcesoInput): Promise<CrearProcesoOutput>;
}
