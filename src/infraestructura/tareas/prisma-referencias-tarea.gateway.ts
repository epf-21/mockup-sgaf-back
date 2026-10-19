import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { ReferenciasTareaGateway } from '../../dominio/tareas/gateways/referencias-tarea.gateway';
import type { DatosUsuarioTarea } from '../../dominio/tareas/tipos/tarea';

@Injectable()
export class PrismaReferenciasTareaGateway implements ReferenciasTareaGateway {
  constructor(private readonly prisma: PrismaService) {}

  async usuariosExistentes(ids: string[]): Promise<string[]> {
    if (ids.length === 0) return [];

    const usuarios = await this.prisma.usuario.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    return usuarios.map((usuario) => usuario.id);
  }

  async usuarioExiste(id: string): Promise<DatosUsuarioTarea | null> {
    return this.prisma.usuario.findUnique({
      where: { id },
      select: { id: true, rol: true, activo: true },
    });
  }
}
