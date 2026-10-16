import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { UnidadGateway } from '../../dominio/unidades/gateways/unidad.gateway';

@Injectable()
export class PrismaUnidadGateway implements UnidadGateway {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    return this.prisma.unidad_organizacional.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  }
}
