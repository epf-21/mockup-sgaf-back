import type { ProcesoDetalle } from '../../../dominio/procesos/tipos/proceso';

export abstract class ObtenerProcesoInputBoundary {
  abstract execute(id: string): Promise<ProcesoDetalle>;
}
