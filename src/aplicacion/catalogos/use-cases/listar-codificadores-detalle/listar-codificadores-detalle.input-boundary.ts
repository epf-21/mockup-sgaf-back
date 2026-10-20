import type { ListarCodificadoresDetalleOutput } from './listar-codificadores-detalle.output';

export abstract class ListarCodificadoresDetalleInputBoundary {
  abstract execute(): Promise<ListarCodificadoresDetalleOutput>;
}
