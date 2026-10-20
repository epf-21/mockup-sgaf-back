export interface ProcesoUsuarioDetalleOutput {
  id: string;
  nombre_completo: string;
  email: string;
}

export interface ProcesoEtapaDetalleOutput {
  etapa:
    | 'solicitud'
    | 'autorizacion'
    | 'ejecucion'
    | 'aceptacion'
    | 'cierre'
    | 'rechazo';
  usuario_id: string | null;
  usuario: ProcesoUsuarioDetalleOutput | null;
  fecha: Date | null;
  ok: boolean;
  observacion: string | null;
}

export interface ProcesoMovimientoDetalleOutput {
  id: string;
  estado: string;
  bien: {
    id: string;
    numero: number;
    descripcion: string;
    codificador: {
      codigo: string;
      nombre: string;
    };
  };
  unidad_origen: { id: string; nombre: string } | null;
  ubicacion_origen: { id: string; nombre: string } | null;
  responsable_origen: { id: string; nombre_completo: string } | null;
  unidad_destino: { id: string; nombre: string } | null;
  ubicacion_destino: { id: string; nombre: string } | null;
  responsable_destino: { id: string; nombre_completo: string } | null;
  motivo: string | null;
  observaciones: string | null;
}

export interface ObtenerProcesoOutput {
  id: string;
  codigo: string;
  estado: string;
  descripcion: string | null;
  observaciones: string | null;
  fecha_solicitud: Date | null;
  fecha_autorizacion: Date | null;
  fecha_inicio_ejecucion: Date | null;
  fecha_cierre: Date | null;
  rechazado: boolean;
  tipo: {
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
  tarea: {
    id: string;
    codigo: string;
    nombre: string;
    categoria: string;
    gestion: number;
    fecha_inicio: Date;
  };
  solicitante: ProcesoUsuarioDetalleOutput | null;
  autorizado_por: ProcesoUsuarioDetalleOutput | null;
  cerrado_por: ProcesoUsuarioDetalleOutput | null;
  etapas: ProcesoEtapaDetalleOutput[];
  movimientos: ProcesoMovimientoDetalleOutput[];
  bienes: number;
}
