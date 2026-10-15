import type {
  BienCreado,
  BienDetalle,
  NuevoBien,
  Paginacion,
  PaginaBienResumen,
} from '../tipos/bien';

export abstract class BienRepositoryPort {
  abstract listarPaginado(paginacion: Paginacion): Promise<PaginaBienResumen>;
  abstract obtenerDetalle(id: string): Promise<BienDetalle | null>;
  abstract existeNumero(numero: number): Promise<boolean>;
  abstract crearConComponentes(
    padre: NuevoBien,
    componentes: NuevoBien[],
  ): Promise<BienCreado>;
}
