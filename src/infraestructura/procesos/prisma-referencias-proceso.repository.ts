import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { ReferenciasProcesoRepository } from '../../aplicacion/procesos/ports/referencias-proceso.repository';
import type {
  DatosTareaProceso,
  DatosTipoProceso,
} from '../../dominio/procesos/tipos/proceso';
import type { DatosUsuarioProceso } from '../../aplicacion/procesos/tipos/proceso';

@Injectable()
export class PrismaReferenciasProcesoRepository implements ReferenciasProcesoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async tareaExiste(id: string): Promise<DatosTareaProceso | null> {
    return this.prisma.tarea.findUnique({
      where: { id },
      select: {
        id: true,
        codigo: true,
        categoria: true,
        gestion: true,
        creado_por_id: true,
        estado: true,
      },
    });
  }

  async tipoProcesoExiste(id: string): Promise<DatosTipoProceso | null> {
    return this.prisma.tipo_proceso.findUnique({
      where: { id },
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
    });
  }

  async usuarioExiste(id: string): Promise<DatosUsuarioProceso | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        rol: true,
        activo: true,
        persona: { select: { nombre_completo: true } },
      },
    });

    if (!usuario) return null;

    return {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      nombre_completo: usuario.persona?.nombre_completo ?? '',
    };
  }

  async bienExiste(id: string): Promise<boolean> {
    const bien = await this.prisma.bien.findUnique({
      where: { id },
      select: { id: true },
    });
    return bien !== null;
  }

  async unidadExiste(id: string): Promise<boolean> {
    const unidad = await this.prisma.unidad_organizacional.findUnique({
      where: { id },
      select: { id: true },
    });
    return unidad !== null;
  }

  async ubicacionExiste(id: string): Promise<boolean> {
    const ubicacion = await this.prisma.ubicacion.findUnique({
      where: { id },
      select: { id: true },
    });
    return ubicacion !== null;
  }

  async personaExiste(id: string): Promise<boolean> {
    const persona = await this.prisma.persona.findUnique({
      where: { id },
      select: { id: true },
    });
    return persona !== null;
  }
}
