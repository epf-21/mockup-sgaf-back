import type { CodificadorDetalleOutput } from '../use-cases/listar-codificadores-detalle/listar-codificadores-detalle.output';
import type { CodificadorResumenOutput } from '../use-cases/listar-codificadores-resumen/listar-codificadores-resumen.output';

export abstract class CodificadorRepository {
  abstract listarResumen(): Promise<CodificadorResumenOutput[]>;
  abstract listarDetalle(): Promise<CodificadorDetalleOutput[]>;
}
