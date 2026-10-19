export enum EstadoTarea {
  Asignada = 'asignada',
  EnEjecucion = 'en_ejecucion',
  Pausada = 'pausada',
  Cerrada = 'cerrada',
  Cancelada = 'cancelada',
}

export const ROLES_CIERRE_TAREA: readonly string[] = ['administrador'];

export enum CategoriaProceso {
  Alta = 'alta',
  Baja = 'baja',
  Movimiento = 'movimiento',
  Custodia = 'custodia',
  Mantenimiento = 'mantenimiento',
  Regularizacion = 'regularizacion',
  Prestamo = 'prestamo',
}

export type NuevaTarea = {
  nombre: string;
  descripcion: string | null;
  categoria: CategoriaProceso;
  creado_por_id: string;
  gestion: number;
  estado: EstadoTarea;
  supervisores: string[];
  inventariadores: string[];
};

export interface TareaCreada {
  id: string;
  codigo: string;
  nombre: string;
  estado: string;
  categoria: string;
}

export interface TareaResumen {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  supervisores: number;
  procesos: number;
  estado: string;
}

export interface Paginacion {
  pagina: number;
  porPagina: number;
}

export interface PaginaTareaResumen {
  datos: TareaResumen[];
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
  siguiente: number | null;
  anterior: number | null;
}

export interface TareaUsuarioDetalle {
  usuario_id: string;
  nombre_completo: string;
  email: string;
}

export interface DatosUsuarioTarea {
  id: string;
  rol: string;
  activo: boolean;
}

export interface ProcesoResumen {
  id: string;
  codigo: string | null;
  estado: string;
  tipo: { codigo: string; nombre: string };
  fecha_autorizacion: Date | null;
  fecha_cierre: Date | null;
}

export interface TareaDetalle {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  estado: string;
  gestion: number;
  fecha_inicio: Date;
  fecha_finalizacion: Date | null;
  creado_por: TareaUsuarioDetalle;
  supervisores: TareaUsuarioDetalle[];
  inventariadores: TareaUsuarioDetalle[];
  procesos: ProcesoResumen[];
}
