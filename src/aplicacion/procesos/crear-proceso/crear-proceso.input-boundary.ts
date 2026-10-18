import type { ProcesoCreado } from '../../../dominio/procesos/tipos/proceso';
import type { CrearProcesoInput } from './crear-proceso.input';

export abstract class CrearProcesoInputBoundary {
  abstract execute(input: CrearProcesoInput): Promise<ProcesoCreado>;
}
