import {
  normalizarPaginacion,
  type Paginacion,
} from '../../../aplicacion/comun/paginacion/paginacion';
import type { ListarProcesosInput } from '../../../aplicacion/procesos/input/listar-procesos.input';
import { ListarProcesosQuery } from '../dto/listar-procesos.query';

export class ListarProcesosMapper {
  static toPaginacion(query: ListarProcesosQuery): Paginacion {
    return normalizarPaginacion({
      pagina: query.pagina,
      porPagina: query.por_pagina,
    });
  }

  static toInput(query: ListarProcesosQuery): ListarProcesosInput {
    return {
      paginacion: this.toPaginacion(query),
      categoria: query.categoria ?? null,
      tipoProcesoId: query.tipo_proceso_id ?? null,
      estado: query.estado ?? null,
      unidadDestinoId: query.unidad_destino_id ?? null,
    };
  }
}
