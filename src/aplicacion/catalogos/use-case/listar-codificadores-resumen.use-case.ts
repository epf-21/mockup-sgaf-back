import type { CodificadorRepository } from '../ports/codificador.repository';
import type { ListarCodificadoresResumenOutput } from '../output/listar-codificadores-resumen.output';
import type { ListarCodificadoresResumenInputBoundary } from '../input-boundary/listar-codificadores-resumen.input-boundary';

export class ListarCodificadoresResumenUseCase implements ListarCodificadoresResumenInputBoundary {
  constructor(private readonly repositorio: CodificadorRepository) {}

  execute(): Promise<ListarCodificadoresResumenOutput> {
    return this.repositorio.listarResumen();
  }
}
