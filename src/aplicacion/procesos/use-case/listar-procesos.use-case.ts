import type { ProcesoRepository } from '../ports/proceso.repository';
import type { ListarProcesosInput } from '../input/listar-procesos.input';
import type { ListarProcesosOutput } from '../output/listar-procesos.output';
import type { ListarProcesosInputBoundary } from '../input-boundary/listar-procesos.input-boundary';

export class ListarProcesosUseCase implements ListarProcesosInputBoundary {
  constructor(private readonly procesos: ProcesoRepository) {}

  execute(input: ListarProcesosInput): Promise<ListarProcesosOutput> {
    return this.procesos.listarPaginado(input);
  }
}
