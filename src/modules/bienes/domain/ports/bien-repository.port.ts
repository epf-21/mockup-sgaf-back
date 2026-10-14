import type { BienCreado, BienResumen, NuevoBien } from '../tipos/bien';

export abstract class BienRepositoryPort {
  abstract listarRaiz(): Promise<BienResumen[]>;
  abstract existeNumero(numero: number): Promise<boolean>;
  abstract crearConComponentes(
    padre: NuevoBien,
    componentes: NuevoBien[],
  ): Promise<BienCreado>;
}
