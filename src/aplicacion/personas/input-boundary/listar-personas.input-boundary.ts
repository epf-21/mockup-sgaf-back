import type { ListarPersonasOutput } from '../output/listar-personas.output';

export abstract class ListarPersonasInputBoundary {
  abstract execute(): Promise<ListarPersonasOutput[]>;
}
