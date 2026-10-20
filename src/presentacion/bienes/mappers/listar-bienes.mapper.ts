import {
  normalizarPaginacion,
  type Paginacion,
} from '../../../aplicacion/comun/paginacion/paginacion';
import { ListarBienesQuery } from '../dto/listar-bienes.query';

export class ListarBienesMapper {
  static toPaginacion(query: ListarBienesQuery): Paginacion {
    return normalizarPaginacion({
      pagina: query.pagina,
      porPagina: query.por_pagina,
    });
  }
}
