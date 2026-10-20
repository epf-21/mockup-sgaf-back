export enum EstadoTarea {
  Asignada = 'asignada',
  EnEjecucion = 'en_ejecucion',
  Pausada = 'pausada',
  Cerrada = 'cerrada',
  Cancelada = 'cancelada',
}

export enum CategoriaProceso {
  Alta = 'alta',
  Baja = 'baja',
  Movimiento = 'movimiento',
  Custodia = 'custodia',
  Mantenimiento = 'mantenimiento',
  Regularizacion = 'regularizacion',
  Prestamo = 'prestamo',
}

export interface DatosCreacionTarea {
  nombre: string;
  categoria: CategoriaProceso;
  creadoPorId: string;
  estado: EstadoTarea;
  supervisores: string[];
  inventariadores: string[];
}
