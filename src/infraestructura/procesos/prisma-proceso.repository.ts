import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../base-datos/prisma.service';
import type { ProcesoRepository } from '../../aplicacion/procesos/ports/proceso.repository';
import {
  EstadoMovimiento,
  EstadoProceso,
  type CambiosProceso,
  type DatosMovimientoWorkflow,
  type DatosProcesoWorkflow,
} from '../../dominio/procesos/tipos/proceso';
import {
  EtapaProceso,
  type NuevoProceso,
} from '../../aplicacion/procesos/tipos/proceso';
import type { Paginacion } from '../../aplicacion/comun/paginacion/paginacion';
import {
  calcularOffset,
  crearPaginaOutput,
} from '../../aplicacion/comun/paginacion/paginacion';
import type { ListarProcesosInput } from '../../aplicacion/procesos/input/listar-procesos.input';
import type { CrearProcesoOutput } from '../../aplicacion/procesos/output/crear-proceso.output';
import type { ListarProcesosOutput } from '../../aplicacion/procesos/output/listar-procesos.output';
import type { ListarProcesosResumenOutput } from '../../aplicacion/procesos/output/listar-procesos-resumen.output';
import type {
  ObtenerProcesoOutput,
  ProcesoEtapaDetalleOutput,
  ProcesoMovimientoDetalleOutput,
  ProcesoUsuarioDetalleOutput,
} from '../../aplicacion/procesos/output/obtener-proceso.output';

@Injectable()
export class PrismaProcesoRepository implements ProcesoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(proceso: NuevoProceso): Promise<CrearProcesoOutput> {
    return this.prisma.$transaction(async (tx) => {
      const codigo = await this.generarCodigo(tx, proceso.gestion);

      const creado = await tx.procesos.create({
        data: {
          codigo,
          tarea_id: proceso.tarea_id,
          tipo_proceso_id: proceso.tipo_proceso_id,
          estado: proceso.estado,
          descripcion: proceso.descripcion,
          fecha_autorizacion: null,
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
    input: ListarProcesosInput,
  ): Promise<ListarProcesosOutput> {
    const skip = calcularOffset(input.paginacion);
    const where: Prisma.procesosWhereInput = {};

    if (input.categoria) {
      where.tipo_proceso = { categoria: input.categoria as never };
    }
    if (input.tipoProcesoId) {
      where.tipo_proceso_id = input.tipoProcesoId;
    }
    if (input.estado) {
      where.estado = input.estado as never;
    }
    if (input.unidadDestinoId) {
      where.movimientos = {
        some: { unidad_destino_id: input.unidadDestinoId },
      };
    }

    const [total, procesos] = await Promise.all([
      this.prisma.procesos.count({ where }),
      this.prisma.procesos.findMany({
        where,
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
              unidad_destino: { select: { nombre: true } },
            },
          },
        },
        orderBy: [{ codigo: 'desc' }],
        skip,
        take: input.paginacion.porPagina,
      }),
    ]);

    const datos = procesos.map((proceso) => ({
      id: proceso.id,
      codigo: proceso.codigo,
      tipo: {
        codigo: proceso.tipo_proceso.codigo,
        nombre: proceso.tipo_proceso.nombre,
      },
      destino: proceso.movimientos[0]?.unidad_destino?.nombre ?? null,
      estado: proceso.estado,
    }));

    return crearPaginaOutput(datos, total, input.paginacion);
  }

  async listarResumen(
    paginacion: Paginacion,
  ): Promise<ListarProcesosResumenOutput> {
    const skip = calcularOffset(paginacion);

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
              requiere_autorizacion: true,
            },
          },
          movimientos: {
            select: { bien_id: true },
          },
        },
        orderBy: [{ codigo: 'desc' }],
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
      bienes: new Set(
        proceso.movimientos.map((movimiento) => movimiento.bien_id),
      ).size,
      movimientos: proceso.movimientos.length,
      estado: proceso.estado,
      requiere_autorizacion: proceso.tipo_proceso.requiere_autorizacion,
    }));

    return crearPaginaOutput(datos, total, paginacion);
  }

  async obtenerDetalle(id: string): Promise<ObtenerProcesoOutput | null> {
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
            requiere_autorizacion: true,
            requiere_ejecucion_campo: true,
            requiere_aceptacion_custodia: true,
            genera_formulario: true,
            genera_movimiento: true,
            afecta_patrimonio: true,
            afecta_depreciacion: true,
          },
        },
        tarea: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            categoria: true,
            gestion: true,
            fecha_inicio: true,
            creado_por: {
              select: {
                id: true,
                email: true,
                persona: { select: { nombre_completo: true } },
              },
            },
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

    const usuario = (
      registro: {
        id: string;
        email: string;
        persona: { nombre_completo: string } | null;
      } | null,
    ): ProcesoUsuarioDetalleOutput | null =>
      registro
        ? {
            id: registro.id,
            nombre_completo: registro.persona?.nombre_completo ?? '',
            email: registro.email,
          }
        : null;

    const movimientos: ProcesoMovimientoDetalleOutput[] =
      proceso.movimientos.map((movimiento) => ({
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
      }));

    const rechazado =
      proceso.estado === $Enums.estado_proceso.cerrado &&
      proceso.tipo_proceso.requiere_autorizacion &&
      !proceso.autorizado_por &&
      Boolean(proceso.cerrado_por_usuario);

    const todosAceptados =
      movimientos.length > 0 &&
      movimientos.every((movimiento) => movimiento.estado === 'aceptacion');
    const algunEjecucion = movimientos.some(
      (movimiento) =>
        movimiento.estado === 'ejecucion' || movimiento.estado === 'aceptacion',
    );

    const etapas: ProcesoEtapaDetalleOutput[] = [
      {
        etapa: EtapaProceso.Solicitud,
        usuario_id: proceso.tarea.creado_por.id,
        usuario: usuario(proceso.tarea.creado_por),
        fecha: proceso.tarea.fecha_inicio,
        ok: true,
        observacion: null,
      },
    ];

    if (proceso.tipo_proceso.requiere_autorizacion) {
      etapas.push({
        etapa: EtapaProceso.Autorizacion,
        usuario_id: proceso.autorizado_por?.id ?? null,
        usuario: usuario(proceso.autorizado_por),
        fecha: proceso.fecha_autorizacion,
        ok: Boolean(proceso.autorizado_por),
        observacion: null,
      });
    }

    if (proceso.tipo_proceso.requiere_ejecucion_campo && algunEjecucion) {
      etapas.push({
        etapa: EtapaProceso.Ejecucion,
        usuario_id: null,
        usuario: null,
        fecha: null,
        ok: todosAceptados,
        observacion: todosAceptados ? 'Movimientos completados' : 'En curso',
      });
    }

    if (proceso.tipo_proceso.requiere_aceptacion_custodia) {
      const corresponde = proceso.tipo_proceso.requiere_ejecucion_campo
        ? algunEjecucion
        : Boolean(proceso.autorizado_por) ||
          !proceso.tipo_proceso.requiere_autorizacion;

      if (corresponde) {
        const aceptada =
          todosAceptados &&
          (proceso.estado === $Enums.estado_proceso.procesado ||
            proceso.estado === $Enums.estado_proceso.cerrado);

        etapas.push({
          etapa: EtapaProceso.Aceptacion,
          usuario_id: null,
          usuario: null,
          fecha: null,
          ok: aceptada,
          observacion: aceptada ? 'Aceptada' : 'Pendiente',
        });
      }
    }

    if (rechazado) {
      etapas.push({
        etapa: EtapaProceso.Rechazo,
        usuario_id: proceso.cerrado_por_usuario?.id ?? null,
        usuario: usuario(proceso.cerrado_por_usuario),
        fecha: proceso.fecha_cierre,
        ok: false,
        observacion: proceso.observaciones,
      });
    } else if (proceso.estado === $Enums.estado_proceso.cerrado) {
      etapas.push({
        etapa: EtapaProceso.Cierre,
        usuario_id: proceso.cerrado_por_usuario?.id ?? null,
        usuario: usuario(proceso.cerrado_por_usuario),
        fecha: proceso.fecha_cierre,
        ok: true,
        observacion: null,
      });
    }

    return {
      id: proceso.id,
      codigo: proceso.codigo,
      estado: proceso.estado,
      descripcion: proceso.descripcion,
      observaciones: proceso.observaciones,
      fecha_solicitud: proceso.tarea.fecha_inicio,
      fecha_autorizacion: proceso.fecha_autorizacion,
      fecha_inicio_ejecucion: null,
      fecha_cierre: proceso.fecha_cierre,
      rechazado,
      tipo: proceso.tipo_proceso,
      tarea: {
        id: proceso.tarea.id,
        codigo: proceso.tarea.codigo,
        nombre: proceso.tarea.nombre,
        categoria: proceso.tarea.categoria,
        gestion: proceso.tarea.gestion,
        fecha_inicio: proceso.tarea.fecha_inicio,
      },
      solicitante: usuario(proceso.tarea.creado_por),
      autorizado_por: usuario(proceso.autorizado_por),
      cerrado_por: usuario(proceso.cerrado_por_usuario),
      etapas,
      movimientos,
      bienes: movimientos.length,
    };
  }

  async obtenerWorkflow(id: string): Promise<DatosProcesoWorkflow | null> {
    const proceso = await this.prisma.procesos.findUnique({
      where: { id },
      select: {
        id: true,
        codigo: true,
        estado: true,
        descripcion: true,
        observaciones: true,
        autorizado_por_id: true,
        fecha_autorizacion: true,
        cerrado_por_id: true,
        fecha_cierre: true,
        tipo_proceso: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            categoria: true,
            requiere_autorizacion: true,
            requiere_ejecucion_campo: true,
            requiere_aceptacion_custodia: true,
            genera_formulario: true,
            genera_movimiento: true,
            afecta_patrimonio: true,
            afecta_depreciacion: true,
          },
        },
        tarea: {
          select: {
            id: true,
            codigo: true,
            categoria: true,
            gestion: true,
            creado_por_id: true,
            estado: true,
          },
        },
        movimientos: {
          select: {
            id: true,
            bien_id: true,
            estado: true,
            unidad_origen_id: true,
            ubicacion_origen_id: true,
            responsable_origen_id: true,
            unidad_destino_id: true,
            ubicacion_destino_id: true,
            responsable_destino_id: true,
            motivo: true,
            observaciones: true,
          },
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!proceso) return null;

    const movimientos: DatosMovimientoWorkflow[] = proceso.movimientos.map(
      (movimiento) => ({
        ...movimiento,
        estado: movimiento.estado as EstadoMovimiento,
      }),
    );

    return {
      id: proceso.id,
      codigo: proceso.codigo,
      estado: proceso.estado as EstadoProceso,
      descripcion: proceso.descripcion,
      observaciones: proceso.observaciones,
      autorizado_por_id: proceso.autorizado_por_id,
      fecha_autorizacion: proceso.fecha_autorizacion,
      cerrado_por_id: proceso.cerrado_por_id,
      fecha_cierre: proceso.fecha_cierre,
      tipo: proceso.tipo_proceso,
      tarea: proceso.tarea,
      movimientos,
    };
  }

  async obtenerWorkflowPorMovimiento(
    movimientoId: string,
  ): Promise<DatosProcesoWorkflow | null> {
    const movimiento = await this.prisma.movimientos.findUnique({
      where: { id: movimientoId },
      select: { proceso_id: true },
    });

    if (!movimiento) return null;

    return this.obtenerWorkflow(movimiento.proceso_id);
  }

  async aplicarTransicion(
    procesoId: string,
    cambios: CambiosProceso,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const data: Prisma.procesosUncheckedUpdateInput = {
        estado: cambios.estado,
      };

      if (cambios.autorizado_por_id !== undefined) {
        data.autorizado_por_id = cambios.autorizado_por_id;
      }
      if (cambios.fecha_autorizacion !== undefined) {
        data.fecha_autorizacion = cambios.fecha_autorizacion;
      }
      if (cambios.cerrado_por_id !== undefined) {
        data.cerrado_por_id = cambios.cerrado_por_id;
      }
      if (cambios.fecha_cierre !== undefined) {
        data.fecha_cierre = cambios.fecha_cierre;
      }
      if (cambios.observaciones !== undefined) {
        data.observaciones = cambios.observaciones;
      }

      await tx.procesos.update({
        where: { id: procesoId },
        data,
      });

      if (cambios.movimientos) {
        await tx.movimientos.updateMany({
          where: {
            proceso_id: procesoId,
            estado: {
              in: cambios.movimientos.desde,
            },
          },
          data: {
            estado: cambios.movimientos.hacia,
          },
        });
      }

      if (cambios.movimiento_completado_id) {
        await tx.movimientos.update({
          where: { id: cambios.movimiento_completado_id },
          data: {
            estado: EstadoMovimiento.Aceptacion,
            ...(cambios.observacion_movimiento !== undefined && {
              observaciones: cambios.observacion_movimiento,
            }),
          },
        });
      }

      for (const efecto of cambios.efectos_bienes) {
        const dataBien: Prisma.bienUncheckedUpdateInput = {};

        if (efecto.estado !== undefined) {
          dataBien.estado = efecto.estado as $Enums.estado_bien;
        }
        if (efecto.unidad_id !== undefined) {
          dataBien.unidad_id = efecto.unidad_id;
        }
        if (efecto.unidad_costo_id !== undefined) {
          dataBien.unidad_costo_id = efecto.unidad_costo_id;
        }
        if (efecto.ubicacion_id !== undefined) {
          dataBien.ubicacion_id = efecto.ubicacion_id;
        }
        if (efecto.responsable_id !== undefined) {
          dataBien.responsable_id = efecto.responsable_id;
        }
        if (efecto.fecha_baja !== undefined) {
          dataBien.fecha_baja = efecto.fecha_baja;
        }
        if (efecto.motivo_baja !== undefined) {
          dataBien.motivo_baja = efecto.motivo_baja;
        }

        if (Object.keys(dataBien).length > 0) {
          await tx.bien.update({
            where: { id: efecto.bien_id },
            data: dataBien,
          });
        }
      }
    });
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
