import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { ReferenciasBienPort } from '../../dominio/bienes/puertos/referencias-bien.port';

@Injectable()
export class PrismaReferenciasBien implements ReferenciasBienPort {
  constructor(private readonly prisma: PrismaService) {}

  async codificadorExiste(id: string) {
    return this.prisma.codificador.findUnique({
      where: { id },
      select: { id: true, codigo: true },
    });
  }

  async unidadExiste(id: string): Promise<boolean> {
    const unidad = await this.prisma.unidad_organizacional.findUnique({
      where: { id },
      select: { id: true },
    });
    return unidad !== null;
  }

  async personaExiste(id: string): Promise<boolean> {
    const persona = await this.prisma.persona.findUnique({
      where: { id },
      select: { id: true },
    });
    return persona !== null;
  }
}
