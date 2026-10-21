import type { ListarCodificadoresDetalleOutput } from '../output/listar-codificadores-detalle.output';

export abstract class ListarCodificadoresDetalleInputBoundary {
  abstract execute(): Promise<ListarCodificadoresDetalleOutput>;
}
