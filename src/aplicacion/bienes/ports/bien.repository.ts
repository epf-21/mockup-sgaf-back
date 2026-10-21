import type { NuevoBien } from '../tipos/bien';
import type { Paginacion } from '../../comun/paginacion/paginacion';
import type { CrearBienOutput } from '../output/crear-bien.output';
import type { ListarBienesOutput } from '../output/listar-bienes.output';
import type { ObtenerDetalleBienOutput } from '../output/obtener-detalle-bien.output';

export abstract class BienRepository {
  abstract listarPaginado(paginacion: Paginacion): Promise<ListarBienesOutput>;
  abstract obtenerDetalle(id: string): Promise<ObtenerDetalleBienOutput | null>;
  abstract crearConComponentes(
    padre: NuevoBien,
    componentes: NuevoBien[],
  ): Promise<CrearBienOutput>;
}
