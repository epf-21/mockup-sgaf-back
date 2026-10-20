import { NotFoundError } from '../../../../dominio/comun/errores/not-found.error';
import { Tarea } from '../../../../dominio/tareas/entidades/tarea.entity';
import type { ReferenciasTareaRepository } from '../../ports/referencias-tarea.repository';
import type { TareaRepository } from '../../ports/tarea.repository';
import type { CrearTareaOutput } from './crear-tarea.output';
import type { CrearTareaInput } from './crear-tarea.input';
import type { CrearTareaInputBoundary } from './crear-tarea.input-boundary';

export class CrearTareaUseCase implements CrearTareaInputBoundary {
  constructor(
    private readonly tareas: TareaRepository,
    private readonly referencias: ReferenciasTareaRepository,
  ) {}

  async execute(input: CrearTareaInput): Promise<CrearTareaOutput> {
    const usuarios = [
      input.creadoPorId,
      ...input.supervisores,
      ...input.inventariadores,
    ];
    const existentes = new Set(
      await this.referencias.usuariosExistentes([...new Set(usuarios)]),
    );
    const faltante = usuarios.find((id) => !existentes.has(id));
    if (faltante) {
      throw new NotFoundError(`Usuario no encontrado`);
    }

    const tarea = Tarea.crear({
      nombre: input.nombre,
      categoria: input.categoria,
      creadoPorId: input.creadoPorId,
      estado: input.estado,
      supervisores: input.supervisores,
      inventariadores: input.inventariadores,
    });

    return this.tareas.crear({
      nombre: tarea.nombre,
      descripcion: input.descripcion?.trim() || null,
      categoria: tarea.categoria,
      creado_por_id: tarea.creadoPorId,
      gestion: input.gestion ?? new Date().getFullYear(),
      estado: tarea.estado,
      supervisores: tarea.supervisores,
      inventariadores: tarea.inventariadores,
    });
  }
}
