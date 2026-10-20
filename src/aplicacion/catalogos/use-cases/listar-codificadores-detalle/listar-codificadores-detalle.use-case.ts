import type { CodificadorRepository } from '../../ports/codificador.repository';
import type { ListarCodificadoresDetalleOutput } from './listar-codificadores-detalle.output';
import type { ListarCodificadoresDetalleInputBoundary } from './listar-codificadores-detalle.input-boundary';

export class ListarCodificadoresDetalleUseCase implements ListarCodificadoresDetalleInputBoundary {
  constructor(private readonly repositorio: CodificadorRepository) {}

  execute(): Promise<ListarCodificadoresDetalleOutput> {
    return this.repositorio.listarDetalle();
  }
}
