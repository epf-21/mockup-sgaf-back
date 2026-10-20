import type {
  CambiosProceso,
  DatosProcesoWorkflow,
  NuevoProceso,
  PaginacionProcesos,
} from '../../../dominio/procesos/tipos/proceso';
import type { CrearProcesoOutput } from '../use-cases/crear-proceso/crear-proceso.output';
import type { ListarProcesosOutput } from '../use-cases/listar-procesos/listar-procesos.output';
import type { ObtenerProcesoOutput } from '../use-cases/obtener-proceso/obtener-proceso.output';

export abstract class ProcesoRepository {
  abstract crear(proceso: NuevoProceso): Promise<CrearProcesoOutput>;
  abstract listarPaginado(
    paginacion: PaginacionProcesos,
  ): Promise<ListarProcesosOutput>;
  abstract obtenerDetalle(id: string): Promise<ObtenerProcesoOutput | null>;
  abstract obtenerWorkflow(id: string): Promise<DatosProcesoWorkflow | null>;
  abstract obtenerWorkflowPorMovimiento(
    movimientoId: string,
  ): Promise<DatosProcesoWorkflow | null>;
  abstract aplicarTransicion(
    procesoId: string,
    cambios: CambiosProceso,
  ): Promise<void>;
}
