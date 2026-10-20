export enum EstadoProceso {
  Pendiente = 'pendiente',
  Procesado = 'procesado',
  Cerrado = 'cerrado',
}

export enum EstadoMovimiento {
  Solicitud = 'solicitud',
  Autorizado = 'autorizado',
  Ejecucion = 'ejecucion',
  Aceptacion = 'aceptacion',
}

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

export type DatosTareaProceso = {
  id: string;
  codigo: string;
  categoria: string;
  gestion: number;
  creado_por_id: string;
  estado: string;
};

export type DatosTipoProceso = {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  requiere_autorizacion: boolean;
  requiere_ejecucion_campo: boolean;
  requiere_aceptacion_custodia: boolean;
  genera_formulario: boolean;
  genera_movimiento: boolean;
  afecta_patrimonio: boolean;
  afecta_depreciacion: boolean;
};

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

export type DatosMovimientoWorkflow = {
  id: string;
  bien_id: string;
  estado: EstadoMovimiento;
  unidad_origen_id: string | null;
  ubicacion_origen_id: string | null;
  responsable_origen_id: string | null;
  unidad_destino_id: string | null;
  ubicacion_destino_id: string | null;
  responsable_destino_id: string | null;
  motivo: string | null;
  observaciones: string | null;
};

export type DatosProcesoWorkflow = {
  id: string;
  codigo: string;
  estado: EstadoProceso;
  descripcion: string | null;
  observaciones: string | null;
  autorizado_por_id: string | null;
  fecha_autorizacion: Date | null;
  cerrado_por_id: string | null;
  fecha_cierre: Date | null;
  tipo: DatosTipoProceso;
  tarea: DatosTareaProceso;
  movimientos: DatosMovimientoWorkflow[];
};

export type NuevoProceso = {
  tarea_id: string;
  tipo_proceso_id: string;
  gestion: number;
  estado: EstadoProceso;
  descripcion: string | null;
  movimientos: DatosMovimiento[];
};

export type PaginacionProcesos = {
  pagina: number;
  porPagina: number;
};

export interface CambioMovimientos {
  desde: EstadoMovimiento[];
  hacia: EstadoMovimiento;
}

export interface EfectoBien {
  bien_id: string;
  estado?: string;
  unidad_id?: string;
  unidad_costo_id?: string;
  ubicacion_id?: string;
  responsable_id?: string;
  fecha_baja?: Date;
  motivo_baja?: string;
}

export interface CambiosProceso {
  estado: EstadoProceso;
  autorizado_por_id?: string;
  fecha_autorizacion?: Date;
  cerrado_por_id?: string;
  fecha_cierre?: Date;
  observaciones?: string | null;
  movimientos?: CambioMovimientos;
  movimiento_completado_id?: string;
  observacion_movimiento?: string | null;
  efectos_bienes: EfectoBien[];
}
