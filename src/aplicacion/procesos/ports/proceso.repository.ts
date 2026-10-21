import type {
  CambiosProceso,
  DatosProcesoWorkflow,
} from '../../../dominio/procesos/tipos/proceso';
import type { NuevoProceso } from '../tipos/proceso';
import type { Paginacion } from '../../comun/paginacion/paginacion';
import type { CrearProcesoOutput } from '../output/crear-proceso.output';
import type { ListarProcesosOutput } from '../output/listar-procesos.output';
import type { ObtenerProcesoOutput } from '../output/obtener-proceso.output';

export abstract class ProcesoRepository {
  abstract crear(proceso: NuevoProceso): Promise<CrearProcesoOutput>;
  abstract listarPaginado(
    paginacion: Paginacion,
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
