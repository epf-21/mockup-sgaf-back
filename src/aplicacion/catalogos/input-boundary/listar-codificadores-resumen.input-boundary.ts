import type { ListarCodificadoresResumenOutput } from '../output/listar-codificadores-resumen.output';

export abstract class ListarCodificadoresResumenInputBoundary {
  abstract execute(): Promise<ListarCodificadoresResumenOutput>;
}
