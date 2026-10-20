import type { NuevaTarea } from '../tipos/tarea';
import type { Paginacion } from '../../comun/paginacion/paginacion';
import type { CrearTareaOutput } from '../use-cases/crear-tarea/crear-tarea.output';
import type { ListarTareasOutput } from '../use-cases/listar-tareas/listar-tareas.output';
import type { ObtenerTareaOutput } from '../use-cases/obtener-tarea/obtener-tarea.output';

export abstract class TareaRepository {
  abstract crear(tarea: NuevaTarea): Promise<CrearTareaOutput>;
  abstract listarPaginado(paginacion: Paginacion): Promise<ListarTareasOutput>;
  abstract obtenerDetalle(id: string): Promise<ObtenerTareaOutput | null>;
  abstract cerrar(id: string, fechaFinalizacion: Date): Promise<void>;
}
