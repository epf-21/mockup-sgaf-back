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
