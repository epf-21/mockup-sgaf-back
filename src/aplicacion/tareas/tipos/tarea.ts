import type {
  CategoriaProceso,
  EstadoTarea,
} from '../../../dominio/tareas/tipos/tarea';

export const ROLES_CIERRE_TAREA: readonly string[] = ['administrador'];

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
