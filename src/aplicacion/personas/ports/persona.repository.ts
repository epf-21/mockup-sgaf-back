import { ListarPersonasOutput } from '../output/listar-personas.output';

export abstract class PersonaRepository {
  abstract listar(): Promise<ListarPersonasOutput[]>;
}
