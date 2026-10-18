export enum EstadoProceso {
  Pendiente = 'pendiente',
  Procesado = 'procesado',
  Cerrado = 'cerrado',
}

export type DatosTareaProceso = {
  id: string;
  codigo: string;
  categoria: string;
  gestion: number;
};

export type DatosTipoProceso = {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  genera_movimiento: boolean;
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

export interface ProcesoCreado {
  id: string;
  codigo: string;
  estado: string;
  descripcion: string | null;
  tipo_proceso: {
    id: string;
    codigo: string;
    nombre: string;
    categoria: string;
  };
  tarea: {
    id: string;
    codigo: string;
    categoria: string;
  };
  movimientos: number;
}

export type PaginacionProcesos = {
  pagina: number;
  porPagina: number;
};

export interface ProcesoResumen {
  id: string;
  codigo: string;
  tipo: {
    codigo: string;
    nombre: string;
  };
  unidad_origen: string | null;
  unidad_destino: string | null;
  bienes: number;
  estado: string;
}

export interface PaginaProcesoResumen {
  datos: ProcesoResumen[];
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
  siguiente: number | null;
  anterior: number | null;
}

export interface ProcesoUsuarioDetalle {
  id: string;
  nombre_completo: string;
  email: string;
}

export interface ProcesoMovimientoDetalle {
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

export interface ProcesoDetalle {
  id: string;
  codigo: string;
  estado: string;
  descripcion: string | null;
  observaciones: string | null;
  fecha_autorizacion: Date | null;
  fecha_cierre: Date | null;
  tipo: {
    id: string;
    codigo: string;
    nombre: string;
    categoria: string;
  };
  tarea: {
    id: string;
    codigo: string;
    nombre: string;
    categoria: string;
    gestion: number;
  };
  autorizado_por: ProcesoUsuarioDetalle | null;
  cerrado_por: ProcesoUsuarioDetalle | null;
  movimientos: ProcesoMovimientoDetalle[];
  bienes: number;
}
