import type {
  NuevoProceso,
  PaginacionProcesos,
  PaginaProcesoResumen,
  ProcesoDetalle,
  ProcesoCreado,
} from '../tipos/proceso';

export abstract class ProcesoGateway {
  abstract crear(proceso: NuevoProceso): Promise<ProcesoCreado>;
  abstract listarPaginado(
    paginacion: PaginacionProcesos,
  ): Promise<PaginaProcesoResumen>;
  abstract obtenerDetalle(id: string): Promise<ProcesoDetalle | null>;
}
