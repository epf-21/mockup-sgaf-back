import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { UnidadRepositoryPort } from '../../dominio/unidades/puertos/unidad-repository.port';

@Injectable()
export class PrismaUnidadRepository implements UnidadRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    return this.prisma.unidad_organizacional.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  }
}
