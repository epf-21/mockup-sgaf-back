import type { ListarCodificadoresResumenOutput } from './listar-codificadores-resumen.output';

export abstract class ListarCodificadoresResumenInputBoundary {
  abstract execute(): Promise<ListarCodificadoresResumenOutput>;
}
