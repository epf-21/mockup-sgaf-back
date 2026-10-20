import {
  CategoriaProceso,
  EstadoTarea,
  DatosCreacionTarea,
} from '../tipos/tarea';
import { NombreTareaRequeridoError } from '../errores/nombre-tarea-requerido.error';

export class Tarea {
  private constructor(
    readonly nombre: string,
    readonly categoria: CategoriaProceso,
    readonly creadoPorId: string,
    readonly estado: EstadoTarea,
    readonly supervisores: string[],
    readonly inventariadores: string[],
  ) {}

  static crear(datos: DatosCreacionTarea): Tarea {
    const nombre = (datos.nombre ?? '').trim();
    if (nombre.length === 0 || nombre.length > 100) {
      throw new NombreTareaRequeridoError();
    }

    return new Tarea(
      nombre,
      datos.categoria,
      datos.creadoPorId,
      datos.estado,
      [...new Set(datos.supervisores)],
      [...new Set(datos.inventariadores)],
    );
  }
}
