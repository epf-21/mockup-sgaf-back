import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import type { PersonaRepositoryPort } from '../domain/ports/persona-repository.port';

@Injectable()
export class PrismaPersonaRepository implements PersonaRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    const personas = await this.prisma.persona.findMany({
      select: {
        id: true,
        nombre_completo: true,
      },
      orderBy: { nombre_completo: 'asc' },
    });

    return personas.map(({ id, nombre_completo }) => ({
      id,
      nombre: nombre_completo,
    }));
  }
}
