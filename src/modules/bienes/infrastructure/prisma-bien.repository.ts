import { BadRequestException, Injectable } from '@nestjs/common';
import type { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import type { BienRepositoryPort } from '../domain/ports/bien-repository.port';
import type {
  AtributosBien,
  BienCreado,
  FiltroAtributo,
  FiltrosBienes,
  NuevoBien,
  Paginacion,
  PaginaBienResumen,
} from '../domain/tipos/bien';

const ESTADO_BIEN_LABEL: Record<string, string> = {
  en_registro: 'En registro',
  activo: 'Activo',
  fuera_de_servicio: 'Fuera de servicio',
  en_prestamo: 'En prestamo',
  baja: 'Baja',
};

function serializarAtributos(atributos: AtributosBien): string | null {
  const entradas = Object.entries(atributos);
  if (entradas.length === 0) return null;
  return entradas.map(([clave, valor]) => `${clave}: ${valor}`).join(', ');
}

function condicionAtributo({
  clave,
  valor,
}: FiltroAtributo): Prisma.bienWhereInput {
  const par = `${clave}: ${valor}`;
  return {
    OR: [
      { atributos: { equals: par } },
      { atributos: { startsWith: `${par}, ` } },
      { atributos: { endsWith: `, ${par}` } },
      { atributos: { contains: `, ${par}, ` } },
    ],
  };
}

function construirWhere(filtros: FiltrosBienes): Prisma.bienWhereInput {
  const AND: Prisma.bienWhereInput[] = [{ padre_id: null }];
  if (filtros.estado) {
    AND.push({ estado: filtros.estado });
  }
  if (filtros.codificadorId) {
    AND.push({ codificador_id: filtros.codificadorId });
  }
  if (filtros.atributos?.length) {
    for (const atributo of filtros.atributos) {
      AND.push(condicionAtributo(atributo));
    }
  }
  return { AND };
}

@Injectable()
export class PrismaBienRepository implements BienRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async listarPaginado(
    filtros: FiltrosBienes,
    paginacion: Paginacion,
  ): Promise<PaginaBienResumen> {
    const where = construirWhere(filtros);
    const skip = (paginacion.pagina - 1) * paginacion.porPagina;

    const [total, bienes] = await this.prisma.$transaction([
      this.prisma.bien.count({ where }),
      this.prisma.bien.findMany({
        where,
        select: {
          id: true,
          padre_id: true,
          numero: true,
          descripcion: true,
          estado: true,
          codificador: {
            select: {
              codigo: true,
              clase: true,
            },
          },
          unidad: {
            select: {
              nombre: true,
            },
          },
          responsable: {
            select: {
              nombre_completo: true,
            },
          },
        },
        orderBy: {
          numero: 'asc',
        },
        skip,
        take: paginacion.porPagina,
      }),
    ]);

    const datos = bienes.map((bien) => ({
      id: bien.id,
      codigo: `${bien.padre_id || bien.codificador.clase === 'material' ? 'NIM' : 'NIA'}-${String(
        bien.numero,
      ).padStart(5, '0')}`,
      descripcion: bien.descripcion,
      codificador: bien.codificador.codigo,
      unidad: bien.unidad.nombre,
      responsable: bien.responsable.nombre_completo,
      estado: ESTADO_BIEN_LABEL[bien.estado] ?? bien.estado,
    }));

    return {
      datos,
      total,
      pagina: paginacion.pagina,
      por_pagina: paginacion.porPagina,
      total_paginas: Math.max(1, Math.ceil(total / paginacion.porPagina)),
    };
  }

  async existeNumero(numero: number): Promise<boolean> {
    const existente = await this.prisma.bien.findUnique({
      where: { numero },
      select: { id: true },
    });
    return existente !== null;
  }

  async crearConComponentes(
    padre: NuevoBien,
    componentes: NuevoBien[],
  ): Promise<BienCreado> {
    return this.prisma.$transaction(async (tx) => {
      const bienPadre = await tx.bien.create({
        data: {
          ...padre,
          atributos: serializarAtributos(padre.atributos),
          numero: await this.generarNumero(tx),
        },
      });

      const bienesComponentes: {
        id: string;
        numero: number;
        descripcion: string;
      }[] = [];
      for (const componente of componentes) {
        const creado = await tx.bien.create({
          data: {
            ...componente,
            atributos: serializarAtributos(componente.atributos),
            padre_id: bienPadre.id,
            numero: await this.generarNumero(tx),
          },
        });
        bienesComponentes.push({
          id: creado.id,
          numero: creado.numero,
          descripcion: creado.descripcion,
        });
      }

      return {
        id: bienPadre.id,
        numero: bienPadre.numero,
        descripcion: bienPadre.descripcion,
        componentes: bienesComponentes,
      };
    });
  }

  private async generarNumero(tx: {
    bien: {
      findUnique: (args: {
        where: { numero: number };
        select: { id: boolean };
      }) => Promise<{ id: string } | null>;
    };
  }): Promise<number> {
    for (let intento = 0; intento < 20; intento += 1) {
      const numero = Math.floor(10000 + Math.random() * 90000);
      const existente = await tx.bien.findUnique({
        where: { numero },
        select: { id: true },
      });
      if (!existente) return numero;
    }
    throw new BadRequestException('No se pudo generar un número NIA/NIM único');
  }
}
