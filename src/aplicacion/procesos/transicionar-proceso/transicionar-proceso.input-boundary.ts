import type { ProcesoDetalle } from '../../../dominio/procesos/tipos/proceso';
import type { TransicionarProcesoInput } from './transicionar-proceso.input';

export abstract class TransicionarProcesoInputBoundary {
  abstract execute(input: TransicionarProcesoInput): Promise<ProcesoDetalle>;
}
