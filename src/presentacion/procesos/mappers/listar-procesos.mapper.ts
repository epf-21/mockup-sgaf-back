import type { PaginacionProcesos } from '../../../dominio/procesos/tipos/proceso';
import { ListarProcesosQuery } from '../dto/listar-procesos.query';

const PAGINA_DEFAULT = 1;
const POR_PAGINA_DEFAULT = 10;

export class ListarProcesosMapper {
  static toPaginacion(query: ListarProcesosQuery): PaginacionProcesos {
    return {
      pagina: query.pagina ?? PAGINA_DEFAULT,
      porPagina: query.por_pagina ?? POR_PAGINA_DEFAULT,
    };
  }
}
