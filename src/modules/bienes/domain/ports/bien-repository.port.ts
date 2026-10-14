import type {
  BienCreado,
  FiltrosBienes,
  NuevoBien,
  Paginacion,
  PaginaBienResumen,
} from '../tipos/bien';

export abstract class BienRepositoryPort {
  abstract listarPaginado(
    filtros: FiltrosBienes,
    paginacion: Paginacion,
  ): Promise<PaginaBienResumen>;
  abstract existeNumero(numero: number): Promise<boolean>;
  abstract crearConComponentes(
    padre: NuevoBien,
    componentes: NuevoBien[],
  ): Promise<BienCreado>;
}
