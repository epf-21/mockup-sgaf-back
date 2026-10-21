import type { CrearTareaInput } from '../../../aplicacion/tareas/input/crear-tarea.input';
import type { CrearTareaBody } from '../dto/crear-tarea.body';

export class CrearTareaMapper {
  static bodyToInput(body: CrearTareaBody): CrearTareaInput {
    return {
      nombre: body.nombre,
      descripcion: body.descripcion ?? null,
      categoria: body.categoria,
      creadoPorId: body.creado_por_id,
      gestion: body.gestion ?? null,
      estado: body.estado,
      supervisores: body.supervisores ?? [],
      inventariadores: body.inventariadores ?? [],
    };
  }
}
