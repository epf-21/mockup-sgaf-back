import type { PersonaGateway } from '../../../dominio/personas/gateways/persona.gateway';
import type { ListarPersonasInputBoundary } from './listar-personas.input-boundary';

export class ListarPersonasUseCase implements ListarPersonasInputBoundary {
  constructor(private readonly repositorio: PersonaGateway) {}

  execute() {
    return this.repositorio.listar();
  }
}
