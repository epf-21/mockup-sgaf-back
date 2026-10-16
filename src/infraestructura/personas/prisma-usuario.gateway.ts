import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { UsuarioGateway } from '../../dominio/personas/gateways/usuario.gateway';

@Injectable()
export class PrismaUsuarioGateway implements UsuarioGateway {
  constructor(private readonly prisma: PrismaService) {}

  async listarActivosGestion() {
    const usuarios = await this.prisma.usuario.findMany({
      where: {
        activo: true,
        rol: {
          in: ['inventariador', 'supervisor', 'administrador'],
        },
      },
      select: {
        id: true,
        rol: true,
        email: true,
        persona: {
          select: {
            nombre_completo: true,
          },
        },
      },
      orderBy: { persona: { nombre_completo: 'asc' } },
    });

    return usuarios.map(({ id, rol, email, persona }) => ({
      id,
      nombre: persona?.nombre_completo ?? email,
      rol,
    }));
  }
}
