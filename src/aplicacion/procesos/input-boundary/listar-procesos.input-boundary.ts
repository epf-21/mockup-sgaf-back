import type { ListarProcesosInput } from '../input/listar-procesos.input';
import type { ListarProcesosOutput } from '../output/listar-procesos.output';

export abstract class ListarProcesosInputBoundary {
  abstract execute(input: ListarProcesosInput): Promise<ListarProcesosOutput>;
}
