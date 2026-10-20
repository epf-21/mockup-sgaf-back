import type { AccionProceso } from '../../../../dominio/procesos/tipos/proceso';

export interface TransicionarProcesoInput {
  procesoId: string;
  accion: AccionProceso;
  usuarioId: string;
  observacion: string | null;
}
