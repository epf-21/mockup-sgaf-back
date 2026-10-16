import type {
  CodificadorDetalle,
  CodificadorResumen,
} from '../tipos/codificador';

export abstract class CodificadorGateway {
  abstract listarResumen(): Promise<CodificadorResumen[]>;
  abstract listarDetalle(): Promise<CodificadorDetalle[]>;
}
