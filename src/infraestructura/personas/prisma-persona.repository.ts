import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { PersonaRepository } from '../../aplicacion/personas/ports/persona.repository';

@Injectable()
export class PrismaPersonaRepository implements PersonaRepository {
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
