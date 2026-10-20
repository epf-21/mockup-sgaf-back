import type { EstadoProceso } from '../../../dominio/procesos/tipos/proceso';

export enum EtapaProceso {
  Solicitud = 'solicitud',
  Autorizacion = 'autorizacion',
  Ejecucion = 'ejecucion',
  Aceptacion = 'aceptacion',
  Cierre = 'cierre',
  Rechazo = 'rechazo',
}

export enum AccionProceso {
  Autorizar = 'autorizar',
  Rechazar = 'rechazar',
  IniciarEjecucion = 'iniciar_ejecucion',
  CompletarMovimiento = 'completar_movimiento',
  Cerrar = 'cerrar',
}

export const ROLES_AUTORIZACION: readonly string[] = [
  'supervisor',
  'administrador',
];
export const ROLES_EJECUCION: readonly string[] = ['inventariador'];
export const ROLES_CIERRE_PROCESO: readonly string[] = ['supervisor'];

export type DatosUsuarioProceso = {
  id: string;
  email: string;
  rol: string;
  activo: boolean;
  nombre_completo: string;
};

export type DatosMovimiento = {
  bien_id: string;
  unidad_origen_id: string | null;
  ubicacion_origen_id: string | null;
  responsable_origen_id: string | null;
  unidad_destino_id: string | null;
  ubicacion_destino_id: string | null;
  responsable_destino_id: string | null;
  motivo: string | null;
  observaciones: string | null;
};

export type NuevoProceso = {
  tarea_id: string;
  tipo_proceso_id: string;
  gestion: number;
  estado: EstadoProceso;
  descripcion: string | null;
  movimientos: DatosMovimiento[];
};
