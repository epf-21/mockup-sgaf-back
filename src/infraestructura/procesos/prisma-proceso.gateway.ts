import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../base-datos/prisma.service';
import type { ProcesoGateway } from '../../dominio/procesos/gateways/proceso.gateway';
import type {
  NuevoProceso,
  PaginacionProcesos,
  PaginaProcesoResumen,
  ProcesoDetalle,
  ProcesoMovimientoDetalle,
  ProcesoCreado,
} from '../../dominio/procesos/tipos/proceso';

@Injectable()
export class PrismaProcesoGateway implements ProcesoGateway {
  constructor(private readonly prisma: PrismaService) {}

  async crear(proceso: NuevoProceso): Promise<ProcesoCreado> {
    return this.prisma.$transaction(async (tx) => {
      const codigo = await this.generarCodigo(tx, proceso.gestion);

      const creado = await tx.procesos.create({
        data: {
          codigo,
          tarea_id: proceso.tarea_id,
          tipo_proceso_id: proceso.tipo_proceso_id,
          estado: proceso.estado,
          descripcion: proceso.descripcion,
          movimientos:
            proceso.movimientos.length > 0
              ? { create: proceso.movimientos }
              : undefined,
        },
        select: {
          id: true,
          codigo: true,
          estado: true,
          descripcion: true,
          tipo_proceso: {
            select: {
              id: true,
              codigo: true,
              nombre: true,
              categoria: true,
            },
          },
          tarea: {
            select: {
              id: true,
              codigo: true,
              categoria: true,
            },
          },
          _count: {
            select: { movimientos: true },
          },
        },
      });

      return {
        id: creado.id,
        codigo: creado.codigo,
        estado: creado.estado,
        descripcion: creado.descripcion,
        tipo_proceso: creado.tipo_proceso,
        tarea: creado.tarea,
        movimientos: creado._count.movimientos,
      };
    });
  }

  async listarPaginado(
    paginacion: PaginacionProcesos,
  ): Promise<PaginaProcesoResumen> {
    const skip = (paginacion.pagina - 1) * paginacion.porPagina;

    const [total, procesos] = await Promise.all([
      this.prisma.procesos.count(),
      this.prisma.procesos.findMany({
        select: {
          id: true,
          codigo: true,
          estado: true,
          tipo_proceso: {
            select: {
              codigo: true,
              nombre: true,
            },
          },
          movimientos: {
            take: 1,
            orderBy: { id: 'asc' },
            select: {
              unidad_origen: { select: { nombre: true } },
              unidad_destino: { select: { nombre: true } },
            },
          },
          _count: {
            select: { movimientos: true },
          },
        },
        orderBy: [
          { fecha_autorizacion: { sort: 'desc', nulls: 'last' } },
          { codigo: 'desc' },
        ],
        skip,
        take: paginacion.porPagina,
      }),
    ]);

    const datos = procesos.map((proceso) => ({
      id: proceso.id,
      codigo: proceso.codigo,
      tipo: {
        codigo: proceso.tipo_proceso.codigo,
        nombre: proceso.tipo_proceso.nombre,
      },
      unidad_origen: proceso.movimientos[0]?.unidad_origen?.nombre ?? null,
      unidad_destino: proceso.movimientos[0]?.unidad_destino?.nombre ?? null,
      bienes: proceso._count.movimientos,
      estado: proceso.estado,
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

  async obtenerDetalle(id: string): Promise<ProcesoDetalle | null> {
    const proceso = await this.prisma.procesos.findUnique({
      where: { id },
      select: {
        id: true,
        codigo: true,
        estado: true,
        descripcion: true,
        observaciones: true,
        fecha_autorizacion: true,
        fecha_cierre: true,
        tipo_proceso: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            categoria: true,
          },
        },
        tarea: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            categoria: true,
            gestion: true,
          },
        },
        autorizado_por: {
          select: {
            id: true,
            email: true,
            persona: { select: { nombre_completo: true } },
          },
        },
        cerrado_por_usuario: {
          select: {
            id: true,
            email: true,
            persona: { select: { nombre_completo: true } },
          },
        },
        movimientos: {
          select: {
            id: true,
            estado: true,
            motivo: true,
            observaciones: true,
            bien: {
              select: {
                id: true,
                numero: true,
                descripcion: true,
                codificador: {
                  select: {
                    codigo: true,
                    nombre: true,
                  },
                },
              },
            },
            unidad_origen: { select: { id: true, nombre: true } },
            ubicacion_origen: { select: { id: true, nombre: true } },
            responsable_origen: { select: { id: true, nombre_completo: true } },
            unidad_destino: { select: { id: true, nombre: true } },
            ubicacion_destino: { select: { id: true, nombre: true } },
            responsable_destino: {
              select: { id: true, nombre_completo: true },
            },
          },
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!proceso) return null;

    const usuario = (registro: typeof proceso.autorizado_por) =>
      registro
        ? {
            id: registro.id,
            nombre_completo: registro.persona?.nombre_completo ?? '',
            email: registro.email,
          }
        : null;

    const movimientos: ProcesoMovimientoDetalle[] = proceso.movimientos.map(
      (movimiento) => ({
        id: movimiento.id,
        estado: movimiento.estado,
        bien: {
          id: movimiento.bien.id,
          numero: movimiento.bien.numero,
          descripcion: movimiento.bien.descripcion,
          codificador: movimiento.bien.codificador,
        },
        unidad_origen: movimiento.unidad_origen,
        ubicacion_origen: movimiento.ubicacion_origen,
        responsable_origen: movimiento.responsable_origen,
        unidad_destino: movimiento.unidad_destino,
        ubicacion_destino: movimiento.ubicacion_destino,
        responsable_destino: movimiento.responsable_destino,
        motivo: movimiento.motivo,
        observaciones: movimiento.observaciones,
      }),
    );

    return {
      id: proceso.id,
      codigo: proceso.codigo,
      estado: proceso.estado,
      descripcion: proceso.descripcion,
      observaciones: proceso.observaciones,
      fecha_autorizacion: proceso.fecha_autorizacion,
      fecha_cierre: proceso.fecha_cierre,
      tipo: proceso.tipo_proceso,
      tarea: proceso.tarea,
      autorizado_por: usuario(proceso.autorizado_por),
      cerrado_por: usuario(proceso.cerrado_por_usuario),
      movimientos,
      bienes: movimientos.length,
    };
  }

  private async generarCodigo(
    tx: Prisma.TransactionClient,
    gestion: number,
  ): Promise<string> {
    const prefijo = `PROC-${gestion}-`;
    const ultima = await tx.procesos.findFirst({
      where: { codigo: { startsWith: prefijo } },
      orderBy: { codigo: 'desc' },
      select: { codigo: true },
    });

    const ultimoNumero = ultima
      ? Number.parseInt(ultima.codigo.slice(prefijo.length), 10)
      : 0;
    const siguiente = (Number.isFinite(ultimoNumero) ? ultimoNumero : 0) + 1;

    return `${prefijo}${String(siguiente).padStart(4, '0')}`;
  }
}
