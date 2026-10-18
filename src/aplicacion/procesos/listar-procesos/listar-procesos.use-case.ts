import type { ProcesoGateway } from '../../../dominio/procesos/gateways/proceso.gateway';
import type {
  PaginacionProcesos,
  PaginaProcesoResumen,
} from '../../../dominio/procesos/tipos/proceso';
import type { ListarProcesosInputBoundary } from './listar-procesos.input-boundary';

export class ListarProcesosUseCase implements ListarProcesosInputBoundary {
  constructor(private readonly procesos: ProcesoGateway) {}

  execute(paginacion: PaginacionProcesos): Promise<PaginaProcesoResumen> {
    return this.procesos.listarPaginado(paginacion);
  }
}
