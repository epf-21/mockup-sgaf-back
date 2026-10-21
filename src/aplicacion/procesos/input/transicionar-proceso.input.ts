import type { AccionProceso } from '../tipos/proceso';

export interface TransicionarProcesoInput {
  procesoId: string;
  accion: AccionProceso;
  usuarioId: string;
  observacion: string | null;
}
