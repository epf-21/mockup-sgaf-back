import type { CodificadorGateway } from '../../../dominio/catalogos/gateways/codificador.gateway';
import type { ListarCodificadoresResumenInputBoundary } from './listar-codificadores-resumen.input-boundary';

export class ListarCodificadoresResumenUseCase implements ListarCodificadoresResumenInputBoundary {
  constructor(private readonly repositorio: CodificadorGateway) {}

  execute() {
    return this.repositorio.listarResumen();
  }
}
