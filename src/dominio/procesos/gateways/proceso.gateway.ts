import type {
  CambiosProceso,
  DatosProcesoWorkflow,
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
  abstract obtenerWorkflow(id: string): Promise<DatosProcesoWorkflow | null>;
  abstract obtenerWorkflowPorMovimiento(
    movimientoId: string,
  ): Promise<DatosProcesoWorkflow | null>;
  abstract aplicarTransicion(
    procesoId: string,
    cambios: CambiosProceso,
  ): Promise<void>;
}
