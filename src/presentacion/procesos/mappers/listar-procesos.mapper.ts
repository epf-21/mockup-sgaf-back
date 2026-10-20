import {
  normalizarPaginacion,
  type Paginacion,
} from '../../../aplicacion/comun/paginacion/paginacion';
import { ListarProcesosQuery } from '../dto/listar-procesos.query';

export class ListarProcesosMapper {
  static toPaginacion(query: ListarProcesosQuery): Paginacion {
    return normalizarPaginacion({
      pagina: query.pagina,
      porPagina: query.por_pagina,
    });
  }
}
