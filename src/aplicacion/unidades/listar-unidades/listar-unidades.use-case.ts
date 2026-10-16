import type { UnidadGateway } from '../../../dominio/unidades/gateways/unidad.gateway';
import type { ListarUnidadesInputBoundary } from './listar-unidades.input-boundary';

export class ListarUnidadesUseCase implements ListarUnidadesInputBoundary {
  constructor(private readonly repositorio: UnidadGateway) {}

  execute() {
    return this.repositorio.listar();
  }
}
