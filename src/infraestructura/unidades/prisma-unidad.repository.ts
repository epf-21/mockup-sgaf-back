import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { UnidadRepository } from '../../aplicacion/unidades/ports/unidad.repository';

@Injectable()
export class PrismaUnidadRepository implements UnidadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    return this.prisma.unidad_organizacional.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  }
}
