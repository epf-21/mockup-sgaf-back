import type {
  CodificadorDetalle,
  CodificadorResumen,
} from '../tipos/codificador';

export abstract class CodificadorRepositoryPort {
  abstract listarResumen(): Promise<CodificadorResumen[]>;
  abstract listarDetalle(): Promise<CodificadorDetalle[]>;
}
