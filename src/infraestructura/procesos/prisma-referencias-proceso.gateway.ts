import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { ReferenciasProcesoGateway } from '../../dominio/procesos/gateways/referencias-proceso.gateway';
import type {
  DatosTareaProceso,
  DatosTipoProceso,
} from '../../dominio/procesos/tipos/proceso';

@Injectable()
export class PrismaReferenciasProcesoGateway implements ReferenciasProcesoGateway {
  constructor(private readonly prisma: PrismaService) {}

  async tareaExiste(id: string): Promise<DatosTareaProceso | null> {
    return this.prisma.tarea.findUnique({
      where: { id },
      select: { id: true, codigo: true, categoria: true, gestion: true },
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
        genera_movimiento: true,
      },
    });
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
