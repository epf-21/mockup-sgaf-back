import type { CrearProcesoOutput } from './crear-proceso.output';
import type { CrearProcesoInput } from './crear-proceso.input';

export abstract class CrearProcesoInputBoundary {
  abstract execute(input: CrearProcesoInput): Promise<CrearProcesoOutput>;
}
