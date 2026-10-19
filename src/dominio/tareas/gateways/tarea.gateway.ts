import type {
  NuevaTarea,
  Paginacion,
  PaginaTareaResumen,
  TareaCreada,
  TareaDetalle,
} from '../tipos/tarea';

export abstract class TareaGateway {
  abstract crear(tarea: NuevaTarea): Promise<TareaCreada>;
  abstract listarPaginado(paginacion: Paginacion): Promise<PaginaTareaResumen>;
  abstract obtenerDetalle(id: string): Promise<TareaDetalle | null>;
  abstract cerrar(id: string, fechaFinalizacion: Date): Promise<void>;
}
