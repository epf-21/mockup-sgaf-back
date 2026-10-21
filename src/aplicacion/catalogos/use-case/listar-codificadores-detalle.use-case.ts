import type { CodificadorRepository } from '../ports/codificador.repository';
import type { ListarCodificadoresDetalleOutput } from '../output/listar-codificadores-detalle.output';
import type { ListarCodificadoresDetalleInputBoundary } from '../input-boundary/listar-codificadores-detalle.input-boundary';

export class ListarCodificadoresDetalleUseCase implements ListarCodificadoresDetalleInputBoundary {
  constructor(private readonly repositorio: CodificadorRepository) {}

  execute(): Promise<ListarCodificadoresDetalleOutput> {
    return this.repositorio.listarDetalle();
  }
}
