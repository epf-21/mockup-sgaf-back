import type {
  PaginacionProcesos,
  PaginaProcesoResumen,
} from '../../../dominio/procesos/tipos/proceso';

export abstract class ListarProcesosInputBoundary {
  abstract execute(
    paginacion: PaginacionProcesos,
  ): Promise<PaginaProcesoResumen>;
}
