import type { PersonaRepository } from '../../ports/persona.repository';
import type { ListarPersonasOutput } from './listar-personas.output';
import type { ListarPersonasInputBoundary } from './listar-personas.input-boundary';

export class ListarPersonasUseCase implements ListarPersonasInputBoundary {
  constructor(private readonly repositorio: PersonaRepository) {}

  execute(): Promise<ListarPersonasOutput[]> {
    return this.repositorio.listar();
  }
}
