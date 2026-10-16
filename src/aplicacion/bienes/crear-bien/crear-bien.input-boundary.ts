import type { BienCreado } from '../../../dominio/bienes/tipos/bien';
import type { CrearBienInput } from './crear-bien.input';

export abstract class CrearBienInputBoundary {
  abstract execute(input: CrearBienInput): Promise<BienCreado>;
}
