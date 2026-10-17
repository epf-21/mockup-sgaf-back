import type { Paginacion } from '../../../dominio/tareas/tipos/tarea';
import { ListarTareasQuery } from '../dto/listar-tareas.query';

const PAGINA_DEFAULT = 1;
const POR_PAGINA_DEFAULT = 10;

export class ListarTareasMapper {
  static toPaginacion(query: ListarTareasQuery): Paginacion {
    return {
      pagina: query.pagina ?? PAGINA_DEFAULT,
      porPagina: query.por_pagina ?? POR_PAGINA_DEFAULT,
    };
  }
}
