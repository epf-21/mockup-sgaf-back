import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { ReferenciasTareaRepository } from '../../aplicacion/tareas/ports/referencias-tarea.repository';
import type { DatosUsuarioTarea } from '../../aplicacion/tareas/tipos/tarea';

@Injectable()
export class PrismaReferenciasTareaRepository implements ReferenciasTareaRepository {
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
