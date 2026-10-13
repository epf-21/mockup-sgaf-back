import type {
  CodificadorDetalle,
  CodificadorResumen,
} from '../types/codificador';

export abstract class CodificadorRepositoryPort {
  abstract listarResumen(): Promise<CodificadorResumen[]>;
  abstract listarDetalle(): Promise<CodificadorDetalle[]>;
}
