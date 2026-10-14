import { BadRequestException } from '@nestjs/common';
import {
  EstadoBien,
  type FiltrosBienes,
  type Paginacion,
} from '../../domain/tipos/bien';
import { ListarBienesQuery } from '../dto/listar-bienes.query';

const DEFAULT_PAGINA = 1;
const DEFAULT_POR_PAGINA = 10;

export class ListarBienesMapper {
  static toFiltros(query: ListarBienesQuery): {
    filtros: FiltrosBienes;
    paginacion: Paginacion;
  } {
    return {
      filtros: {
        estado: query.estado ? this.parseEstado(query.estado) : undefined,
        codificadorId: query.codificador_id,
        atributos: query.atributos
          ? this.parseAtributos(query.atributos)
          : undefined,
      },
      paginacion: {
        pagina: query.pagina ?? DEFAULT_PAGINA,
        porPagina: query.por_pagina ?? DEFAULT_POR_PAGINA,
      },
    };
  }

  private static parseEstado(estado: string): EstadoBien {
    const normalizado = estado.trim().toLowerCase().replace(/\s+/g, '_');
    const esValido = Object.values(EstadoBien).includes(
      normalizado as EstadoBien,
    );
    if (!esValido) {
      throw new BadRequestException(
        `Estado inválido: "${estado}". Valores válidos: ${Object.values(EstadoBien).join(', ')}`,
      );
    }
    return normalizado as EstadoBien;
  }

  private static parseAtributos(atributos: string): {
    clave: string;
    valor: string;
  }[] {
    const pares = atributos
      .split(',')
      .map((par) => par.trim())
      .filter((par) => par.length > 0)
      .map((par) => {
        const separador = par.indexOf(':');
        if (separador === -1) {
          throw new BadRequestException(
            `Atributo inválido: "${par}". Formato esperado: "clave:valor"`,
          );
        }
        const clave = par.slice(0, separador).trim();
        const valor = par.slice(separador + 1).trim();
        if (!clave || !valor) {
          throw new BadRequestException(
            `Atributo inválido: "${par}". Formato esperado: "clave:valor"`,
          );
        }
        return { clave, valor };
      });

    if (pares.length === 0) {
      throw new BadRequestException(
        'El filtro de atributos no puede estar vacío. Formato: "clave:valor,clave:valor"',
      );
    }
    return pares;
  }
}
