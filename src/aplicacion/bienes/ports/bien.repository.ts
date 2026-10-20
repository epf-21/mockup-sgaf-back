import type { NuevoBien } from '../tipos/bien';
import type { Paginacion } from '../../comun/paginacion/paginacion';
import type { CrearBienOutput } from '../use-cases/crear-bien/crear-bien.output';
import type { ListarBienesOutput } from '../use-cases/listar-bienes/listar-bienes.output';
import type { ObtenerDetalleBienOutput } from '../use-cases/obtener-detalle-bien/obtener-detalle-bien.output';

export abstract class BienRepository {
  abstract listarPaginado(paginacion: Paginacion): Promise<ListarBienesOutput>;
  abstract obtenerDetalle(id: string): Promise<ObtenerDetalleBienOutput | null>;
  abstract crearConComponentes(
    padre: NuevoBien,
    componentes: NuevoBien[],
  ): Promise<CrearBienOutput>;
}
