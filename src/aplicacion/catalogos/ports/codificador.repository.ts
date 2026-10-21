import type { CodificadorDetalleOutput } from '../output/listar-codificadores-detalle.output';
import type { CodificadorResumenOutput } from '../output/listar-codificadores-resumen.output';

export abstract class CodificadorRepository {
  abstract listarResumen(): Promise<CodificadorResumenOutput[]>;
  abstract listarDetalle(): Promise<CodificadorDetalleOutput[]>;
}
