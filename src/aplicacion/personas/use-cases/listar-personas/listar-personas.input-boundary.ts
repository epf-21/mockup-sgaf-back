import type { ListarPersonasOutput } from './listar-personas.output';

export abstract class ListarPersonasInputBoundary {
  abstract execute(): Promise<ListarPersonasOutput>;
}
