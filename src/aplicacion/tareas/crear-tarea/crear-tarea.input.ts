import type {
  CategoriaProceso,
  EstadoTarea,
} from '../../../dominio/tareas/tipos/tarea';

export interface CrearTareaInput {
  nombre: string;
  descripcion: string | null;
  categoria: CategoriaProceso;
  creadoPorId: string;
  gestion: number | null;
  estado: EstadoTarea;
  supervisores: string[];
  inventariadores: string[];
}
