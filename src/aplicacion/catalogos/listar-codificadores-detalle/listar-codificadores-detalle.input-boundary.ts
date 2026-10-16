import type { CodificadorDetalle } from '../../../dominio/catalogos/tipos/codificador';

export abstract class ListarCodificadoresDetalleInputBoundary {
  abstract execute(): Promise<CodificadorDetalle[]>;
}
