import { ListarPersonasOutput } from '../use-cases/listar-personas/listar-personas.output';

export abstract class PersonaRepository {
  abstract listar(): Promise<ListarPersonasOutput[]>;
}
