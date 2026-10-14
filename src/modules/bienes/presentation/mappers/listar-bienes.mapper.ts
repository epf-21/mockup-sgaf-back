import type { Paginacion } from '../../domain/tipos/bien';
import { ListarBienesQuery } from '../dto/listar-bienes.query';

const PAGINA_DEFAULT = 1;
const POR_PAGINA_DEFAULT = 10;

export class ListarBienesMapper {
  static toPaginacion(query: ListarBienesQuery): Paginacion {
    return {
      pagina: query.pagina ?? PAGINA_DEFAULT,
      porPagina: query.por_pagina ?? POR_PAGINA_DEFAULT,
    };
  }
}
