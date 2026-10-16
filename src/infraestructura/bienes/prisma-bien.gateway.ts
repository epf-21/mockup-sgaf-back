import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import { Bien } from '../../dominio/bienes/entidades/bien.entity';
import type { BienGateway } from '../../dominio/bienes/gateways/bien.gateway';
import type {
  AtributosBien,
  BienCreado,
  BienDetalle,
  NuevoBien,
  Paginacion,
  PaginaBienResumen,
} from '../../dominio/bienes/tipos/bien';

const ESTADO_BIEN_LABEL: Record<string, string> = {
  en_registro: 'En registro',
  activo: 'Activo',
  fuera_de_servicio: 'Fuera de servicio',
  en_prestamo: 'En prestamo',
  baja: 'Baja',
};

const ESTADO_FISICO_LABEL: Record<string, string> = {
  excelente: 'Excelente',
  muy_bueno: 'Muy bueno',
  bueno: 'Bueno',
  regular: 'Regular',
  malo: 'Malo',
};

const ESTADO_PROCESO_LABEL: Record<string, string> = {
  pendiente: 'Pendiente',
  procesado: 'Procesado',
  cerrado: 'Cerrado',
};

function serializarAtributos(atributos: AtributosBien): string | null {
  const entradas = Object.entries(atributos);
  if (entradas.length === 0) return null;
  return entradas.map(([clave, valor]) => `${clave}: ${valor}`).join(', ');
}

function deserializarAtributos(texto: string | null): Record<string, string> {
  if (!texto) return {};
  const resultado: Record<string, string> = {};
  const pares = texto.split(/,\s+(?=[\w-]+:\s)/);
  for (const par of pares) {
    const separador = par.indexOf(': ');
    if (separador === -1) continue;
    const clave = par.slice(0, separador).trim();
    const valor = par.slice(separador + 2).trim();
    if (clave) resultado[clave] = valor;
  }
  return resultado;
}

@Injectable()
export class PrismaBienGateway implements BienGateway {
  constructor(private readonly prisma: PrismaService) {}

  async listarPaginado(paginacion: Paginacion): Promise<PaginaBienResumen> {
    const where = { padre_id: null };
    const skip = (paginacion.pagina - 1) * paginacion.porPagina;

    const [total, bienes] = await Promise.all([
      this.prisma.bien.count({ where }),
      this.prisma.bien.findMany({
        where,
        select: {
          id: true,
          padre_id: true,
          numero: true,
          descripcion: true,
          estado: true,
          atributos: true,
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
      codigo: Bien.calcularCodigo(
        bien.numero,
        bien.padre_id !== null,
        bien.codificador.clase,
      ),
      descripcion: bien.descripcion,
      codificador: bien.codificador.codigo,
      unidad: bien.unidad.nombre,
      responsable: bien.responsable.nombre_completo,
      estado: ESTADO_BIEN_LABEL[bien.estado] ?? bien.estado,
      atributos: deserializarAtributos(bien.atributos),
    }));

    const totalPaginas = Math.max(1, Math.ceil(total / paginacion.porPagina));

    return {
      datos,
      total,
      pagina: paginacion.pagina,
      por_pagina: paginacion.porPagina,
      total_paginas: totalPaginas,
      siguiente:
        paginacion.pagina < totalPaginas ? paginacion.pagina + 1 : null,
      anterior:
        paginacion.pagina > 1
          ? Math.min(paginacion.pagina - 1, totalPaginas)
          : null,
    };
  }

  async obtenerDetalle(id: string): Promise<BienDetalle | null> {
    const bien = await this.prisma.bien.findUnique({
      where: { id },
      include: {
        codificador: {
          select: { id: true, codigo: true, nombre: true, clase: true },
        },
        unidad: { select: { id: true, codigo: true, nombre: true } },
        unidad_costo: { select: { id: true, codigo: true, nombre: true } },
        responsable: {
          select: {
            id: true,
            documento_identidad: true,
            nombre_completo: true,
          },
        },
        hijos: {
          select: {
            id: true,
            numero: true,
            descripcion: true,
            estado: true,
            atributos: true,
          },
          orderBy: { numero: 'asc' },
        },
        movimientos: {
          select: {
            id: true,
            motivo: true,
            observaciones: true,
            unidad_origen: { select: { nombre: true } },
            ubicacion_origen: { select: { nombre: true } },
            responsable_origen: { select: { nombre_completo: true } },
            unidad_destino: { select: { nombre: true } },
            ubicacion_destino: { select: { nombre: true } },
            responsable_destino: { select: { nombre_completo: true } },
            proceso: {
              select: {
                id: true,
                codigo: true,
                estado: true,
                fecha_autorizacion: true,
                fecha_cierre: true,
                tipo_proceso: {
                  select: { codigo: true, nombre: true, categoria: true },
                },
              },
            },
          },
          orderBy: {
            proceso: { fecha_autorizacion: 'desc' },
          },
        },
      },
    });

    if (!bien) return null;

    return {
      id: bien.id,
      codigo: Bien.calcularCodigo(
        bien.numero,
        bien.padre_id !== null,
        bien.codificador.clase,
      ),
      descripcion: bien.descripcion,
      estado: ESTADO_BIEN_LABEL[bien.estado] ?? bien.estado,
      estado_fisico: bien.estado_fisico
        ? (ESTADO_FISICO_LABEL[bien.estado_fisico] ?? bien.estado_fisico)
        : null,
      patrimonial: bien.patrimonial,
      valor_original:
        bien.valor_original === null ? null : Number(bien.valor_original),
      fecha_alta: bien.fecha_alta,
      fecha_adquisicion: bien.fecha_adquisicion,
      adquisicion: {
        tipo_documento: bien.adquisicion_tipo_documento,
        nro_documento: bien.adquisicion_nro_documento,
      },
      origen: {
        nombre: bien.origen_nombre,
        tipo: bien.origen_tipo,
      },
      ubicacion: bien.ubicacion,
      atributos: deserializarAtributos(bien.atributos),
      codificador: {
        id: bien.codificador.id,
        codigo: bien.codificador.codigo,
        nombre: bien.codificador.nombre,
        clase: bien.codificador.clase,
      },
      unidad: {
        id: bien.unidad.id,
        codigo: bien.unidad.codigo,
        nombre: bien.unidad.nombre,
      },
      unidad_costo: {
        id: bien.unidad_costo.id,
        codigo: bien.unidad_costo.codigo,
        nombre: bien.unidad_costo.nombre,
      },
      responsable: {
        id: bien.responsable.id,
        documento_identidad: bien.responsable.documento_identidad,
        nombre_completo: bien.responsable.nombre_completo,
      },
      componentes: bien.hijos.map((hijo) => ({
        id: hijo.id,
        codigo: Bien.calcularCodigo(hijo.numero, true, 'activo'),
        descripcion: hijo.descripcion,
        estado: ESTADO_BIEN_LABEL[hijo.estado] ?? hijo.estado,
        atributos: deserializarAtributos(hijo.atributos),
      })),
      movimientos: bien.movimientos.map((mov) => ({
        id: mov.id,
        motivo: mov.motivo,
        observaciones: mov.observaciones,
        origen: {
          unidad: mov.unidad_origen?.nombre ?? null,
          ubicacion: mov.ubicacion_origen?.nombre ?? null,
          responsable: mov.responsable_origen?.nombre_completo ?? null,
        },
        destino: {
          unidad: mov.unidad_destino?.nombre ?? null,
          ubicacion: mov.ubicacion_destino?.nombre ?? null,
          responsable: mov.responsable_destino?.nombre_completo ?? null,
        },
        proceso: {
          id: mov.proceso.id,
          codigo: mov.proceso.codigo,
          estado:
            ESTADO_PROCESO_LABEL[mov.proceso.estado] ?? mov.proceso.estado,
          categoria: mov.proceso.tipo_proceso.categoria,
          tipo: {
            codigo: mov.proceso.tipo_proceso.codigo,
            nombre: mov.proceso.tipo_proceso.nombre,
          },
          fecha_autorizacion: mov.proceso.fecha_autorizacion,
          fecha_cierre: mov.proceso.fecha_cierre,
        },
      })),
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
