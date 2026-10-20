import {
  normalizarPaginacion,
  type Paginacion,
} from '../../../aplicacion/comun/paginacion/paginacion';
import { ListarTareasQuery } from '../dto/listar-tareas.query';

export class ListarTareasMapper {
  static toPaginacion(query: ListarTareasQuery): Paginacion {
    return normalizarPaginacion({
      pagina: query.pagina,
      porPagina: query.por_pagina,
    });
  }
}
