import type { CodificadorResumen } from '../../../dominio/catalogos/tipos/codificador';

export abstract class ListarCodificadoresResumenInputBoundary {
  abstract execute(): Promise<CodificadorResumen[]>;
}
