import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../base-datos/prisma.service';
import type { TareaRepository } from '../../aplicacion/tareas/ports/tarea.repository';
import type { NuevaTarea } from '../../aplicacion/tareas/tipos/tarea';
import type { Paginacion } from '../../aplicacion/comun/paginacion/paginacion';
import {
  calcularOffset,
  crearPaginaOutput,
} from '../../aplicacion/comun/paginacion/paginacion';
import type { CrearTareaOutput } from '../../aplicacion/tareas/output/crear-tarea.output';
import type { ListarTareasOutput } from '../../aplicacion/tareas/output/listar-tareas.output';
import type { ObtenerTareaOutput } from '../../aplicacion/tareas/output/obtener-tarea.output';

@Injectable()
export class PrismaTareaRepository implements TareaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(tarea: NuevaTarea): Promise<CrearTareaOutput> {
    return this.prisma.$transaction(async (tx) => {
      const codigo = await this.generarCodigo(tx, tarea.gestion);

      const asignaciones = [
        ...tarea.supervisores.map((usuarioId) => ({
          usuario_id: usuarioId,
          rol: 'supervisor' as const,
        })),
        ...tarea.inventariadores.map((usuarioId) => ({
          usuario_id: usuarioId,
          rol: 'inventariador' as const,
        })),
      ];

      return tx.tarea.create({
        data: {
          codigo,
          nombre: tarea.nombre,
          descripcion: tarea.descripcion,
          categoria: tarea.categoria,
          creado_por_id: tarea.creado_por_id,
          gestion: tarea.gestion,
          estado: tarea.estado,
          tarea_usuarios:
            asignaciones.length > 0 ? { create: asignaciones } : undefined,
        },
        select: {
          id: true,
          codigo: true,
          nombre: true,
          estado: true,
          categoria: true,
        },
      });
    });
  }

  async listarPaginado(paginacion: Paginacion): Promise<ListarTareasOutput> {
    const skip = calcularOffset(paginacion);

    const [total, tareas] = await Promise.all([
      this.prisma.tarea.count(),
      this.prisma.tarea.findMany({
        select: {
          id: true,
          codigo: true,
          nombre: true,
          categoria: true,
          estado: true,
          _count: {
            select: {
              tarea_usuarios: { where: { rol: 'supervisor' } },
              procesos: true,
            },
          },
        },
        orderBy: { fecha_inicio: 'desc' },
        skip,
        take: paginacion.porPagina,
      }),
    ]);

    const datos = tareas.map((tarea) => ({
      id: tarea.id,
      codigo: tarea.codigo,
      nombre: tarea.nombre,
      categoria: tarea.categoria,
      supervisores: tarea._count.tarea_usuarios,
      procesos: tarea._count.procesos,
      estado: tarea.estado,
    }));

    return crearPaginaOutput(datos, total, paginacion);
  }

  async obtenerDetalle(id: string): Promise<ObtenerTareaOutput | null> {
    const tarea = await this.prisma.tarea.findUnique({
      where: { id },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        descripcion: true,
        categoria: true,
        estado: true,
        gestion: true,
        fecha_inicio: true,
        fecha_finalizacion: true,
        creado_por: {
          select: {
            id: true,
            email: true,
            persona: { select: { nombre_completo: true } },
          },
        },
        tarea_usuarios: {
          where: { rol: { in: ['supervisor', 'inventariador'] } },
          select: {
            rol: true,
            usuario: {
              select: {
                id: true,
                email: true,
                persona: { select: { nombre_completo: true } },
              },
            },
          },
        },
        procesos: {
          select: {
            id: true,
            codigo: true,
            estado: true,
            fecha_autorizacion: true,
            fecha_cierre: true,
            tipo_proceso: { select: { codigo: true, nombre: true } },
          },
          orderBy: { codigo: 'desc' },
        },
      },
    });

    if (!tarea) return null;

    const asignados = tarea.tarea_usuarios.map((asignacion) => ({
      rol: asignacion.rol,
      usuario_id: asignacion.usuario.id,
      nombre_completo: asignacion.usuario.persona?.nombre_completo ?? '',
      email: asignacion.usuario.email,
    }));

    const usuariosPorRol = (rol: string) =>
      asignados
        .filter((asignacion) => asignacion.rol === rol)
        .map((asignacion) => ({
          usuario_id: asignacion.usuario_id,
          nombre_completo: asignacion.nombre_completo,
          email: asignacion.email,
        }));

    return {
      id: tarea.id,
      codigo: tarea.codigo,
      nombre: tarea.nombre,
      descripcion: tarea.descripcion,
      categoria: tarea.categoria,
      estado: tarea.estado,
      gestion: tarea.gestion,
      fecha_inicio: tarea.fecha_inicio,
      fecha_finalizacion: tarea.fecha_finalizacion,
      creado_por: {
        usuario_id: tarea.creado_por.id,
        nombre_completo: tarea.creado_por.persona?.nombre_completo ?? '',
        email: tarea.creado_por.email,
      },
      supervisores: usuariosPorRol('supervisor'),
      inventariadores: usuariosPorRol('inventariador'),
      procesos: tarea.procesos.map((proceso) => ({
        id: proceso.id,
        codigo: proceso.codigo,
        estado: proceso.estado,
        tipo: {
          codigo: proceso.tipo_proceso.codigo,
          nombre: proceso.tipo_proceso.nombre,
        },
        fecha_autorizacion: proceso.fecha_autorizacion,
        fecha_cierre: proceso.fecha_cierre,
      })),
    };
  }

  async cerrar(id: string, fechaFinalizacion: Date): Promise<void> {
    await this.prisma.tarea.update({
      where: { id },
      data: {
        estado: 'cerrada',
        fecha_finalizacion: fechaFinalizacion,
      },
    });
  }

  private async generarCodigo(
    tx: Prisma.TransactionClient,
    gestion: number,
  ): Promise<string> {
    const prefijo = `TAR-${gestion}-`;
    const ultima = await tx.tarea.findFirst({
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
