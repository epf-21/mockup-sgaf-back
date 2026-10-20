import type {
  CrearBienBody,
  CrearComponenteBody,
} from '../dto/crear-bien.body';
import type {
  CrearBienInput,
  CrearComponenteInput,
} from '../../../aplicacion/bienes/use-cases/crear-bien/crear-bien.input';

export class CrearBienMapper {
  static bodyToInput(body: CrearBienBody): CrearBienInput {
    return {
      codificadorId: body.codificador_id,
      descripcion: body.descripcion,
      atributos: body.atributos,
      estadoFisico: body.estado_fisico ?? null,
      unidadId: body.unidad_id,
      responsableId: body.responsable_id,
      ubicacion: body.ubicacion ?? null,
      tenencia: body.tenencia,
      propietarioNombre: body.propietario_nombre ?? null,
      patrimonial: body.patrimonial,
      fechaAlta: body.fecha_alta,
      fechaAdquisicion: body.fecha_adquisicion,
      adquisicionTipoDocumento: body.adquisicion_tipo_documento,
      adquisicionNroDocumento: body.adquisicion_nro_documento ?? null,
      valorOriginal: body.valor_original ?? null,
      componentes: body.componentes?.map((c) =>
        CrearBienMapper.componenteToInput(c),
      ),
    };
  }

  private static componenteToInput(
    body: CrearComponenteBody,
  ): CrearComponenteInput {
    return {
      codificadorId: body.codificador_id,
      descripcion: body.descripcion,
      atributos: body.atributos,
      valorOriginal: body.valor_original ?? null,
      unidadId: body.unidad_id ?? null,
      responsableId: body.responsable_id ?? null,
      ubicacion: body.ubicacion ?? null,
    };
  }
}
