import type { CodificadorGateway } from '../../../dominio/catalogos/gateways/codificador.gateway';
import type { ListarCodificadoresDetalleInputBoundary } from './listar-codificadores-detalle.input-boundary';

export class ListarCodificadoresDetalleUseCase implements ListarCodificadoresDetalleInputBoundary {
  constructor(private readonly repositorio: CodificadorGateway) {}

  execute() {
    return this.repositorio.listarDetalle();
  }
}
