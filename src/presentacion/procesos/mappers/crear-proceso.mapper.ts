import type { CrearProcesoInput } from '../../../aplicacion/procesos/input/crear-proceso.input';
import type { CrearProcesoBody } from '../dto/crear-proceso.body';

export class CrearProcesoMapper {
  static bodyToInput(body: CrearProcesoBody): CrearProcesoInput {
    return {
      tareaId: body.tarea_id,
      tipoProcesoId: body.tipo_proceso_id,
      descripcion: body.descripcion ?? null,
      bienes: body.bienes ?? [],
      unidadOrigenId: body.unidad_origen_id ?? null,
      unidadDestinoId: body.unidad_destino_id ?? null,
      ubicacionOrigenId: body.ubicacion_origen_id ?? null,
      ubicacionDestinoId: body.ubicacion_destino_id ?? null,
      responsableOrigenId: body.responsable_origen_id ?? null,
      responsableDestinoId: body.responsable_destino_id ?? null,
      motivo: body.motivo ?? null,
      observaciones: body.observaciones ?? null,
    };
  }
}
