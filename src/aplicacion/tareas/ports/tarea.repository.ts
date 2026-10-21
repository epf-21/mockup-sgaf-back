import type { NuevaTarea } from '../tipos/tarea';
import type { Paginacion } from '../../comun/paginacion/paginacion';
import type { CrearTareaOutput } from '../output/crear-tarea.output';
import type { ListarTareasOutput } from '../output/listar-tareas.output';
import type { ObtenerTareaOutput } from '../output/obtener-tarea.output';

export abstract class TareaRepository {
  abstract crear(tarea: NuevaTarea): Promise<CrearTareaOutput>;
  abstract listarPaginado(paginacion: Paginacion): Promise<ListarTareasOutput>;
  abstract obtenerDetalle(id: string): Promise<ObtenerTareaOutput | null>;
  abstract cerrar(id: string, fechaFinalizacion: Date): Promise<void>;
}
