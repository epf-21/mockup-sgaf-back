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

export interface DatosUsuarioTarea {
  id: string;
  rol: string;
  activo: boolean;
}

export interface Paginacion {
  pagina: number;
  porPagina: number;
}
