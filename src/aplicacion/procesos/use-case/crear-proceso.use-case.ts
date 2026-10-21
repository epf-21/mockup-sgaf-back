import { NotFoundError } from '../../../dominio/comun/errores/not-found.error';
import { TareaNoEncontradaError } from '../../../dominio/tareas/errores/tarea-no-encontrada.error';
import { TipoProcesoNoDisponibleError } from '../../../dominio/procesos/errores/tipo-proceso-no-disponible.error';
import { ProcesoSinBienesError } from '../../../dominio/procesos/errores/proceso-sin-bienes.error';
import { TipoProcesoNoEncontradoError } from '../../../dominio/procesos/errores/tipo-proceso-no-encontrado.error';
import type { ReferenciasProcesoRepository } from '../ports/referencias-proceso.repository';
import type { ProcesoRepository } from '../ports/proceso.repository';
import type { DatosMovimiento } from '../tipos/proceso';
import type { CrearProcesoOutput } from '../output/crear-proceso.output';
import { EstadoProceso } from '../../../dominio/procesos/tipos/proceso';
import type { CrearProcesoInput } from '../input/crear-proceso.input';
import type { CrearProcesoInputBoundary } from '../input-boundary/crear-proceso.input-boundary';

export class CrearProcesoUseCase implements CrearProcesoInputBoundary {
  constructor(
    private readonly procesos: ProcesoRepository,
    private readonly referencias: ReferenciasProcesoRepository,
  ) {}

  async execute(input: CrearProcesoInput): Promise<CrearProcesoOutput> {
    const tarea = await this.referencias.tareaExiste(input.tareaId);
    if (!tarea) {
      throw new TareaNoEncontradaError(input.tareaId);
    }

    const tipo = await this.referencias.tipoProcesoExiste(input.tipoProcesoId);
    if (!tipo) {
      throw new TipoProcesoNoEncontradoError(input.tipoProcesoId);
    }

    if (tipo.categoria !== tarea.categoria) {
      throw new TipoProcesoNoDisponibleError(tipo.nombre, tarea.categoria);
    }

    const bienes = [...new Set(input.bienes)];

    if (tipo.genera_movimiento && bienes.length === 0) {
      throw new ProcesoSinBienesError();
    }

    await this.validarReferencias(
      bienes,
      (id) => this.referencias.bienExiste(id),
      'Bien',
    );
    await this.validarReferencias(
      [input.unidadOrigenId, input.unidadDestinoId],
      (id) => this.referencias.unidadExiste(id),
      'Unidad',
    );
    await this.validarReferencias(
      [input.ubicacionOrigenId, input.ubicacionDestinoId],
      (id) => this.referencias.ubicacionExiste(id),
      'Ubicación',
    );
    await this.validarReferencias(
      [input.responsableOrigenId, input.responsableDestinoId],
      (id) => this.referencias.personaExiste(id),
      'Persona',
    );

    const movimientos: DatosMovimiento[] = bienes.map((bienId) => ({
      bien_id: bienId,
      unidad_origen_id: input.unidadOrigenId,
      ubicacion_origen_id: input.ubicacionOrigenId,
      responsable_origen_id: input.responsableOrigenId,
      unidad_destino_id: input.unidadDestinoId,
      ubicacion_destino_id: input.ubicacionDestinoId,
      responsable_destino_id: input.responsableDestinoId,
      motivo: input.motivo?.trim() || null,
      observaciones: input.observaciones?.trim() || null,
    }));

    const requiereEtapas =
      tipo.requiere_autorizacion ||
      tipo.requiere_ejecucion_campo ||
      tipo.requiere_aceptacion_custodia;

    return this.procesos.crear({
      tarea_id: tarea.id,
      tipo_proceso_id: tipo.id,
      gestion: tarea.gestion,
      estado: requiereEtapas
        ? EstadoProceso.Pendiente
        : EstadoProceso.Procesado,
      descripcion: input.descripcion?.trim() || null,
      movimientos,
    });
  }

  private async validarReferencias(
    ids: Array<string | null>,
    existe: (id: string) => Promise<boolean>,
    entidad: string,
  ): Promise<void> {
    const unicos = [...new Set(ids.filter((id): id is string => Boolean(id)))];
    const resultados = await Promise.all(unicos.map(existe));
    const faltante = unicos.find((_, indice) => !resultados[indice]);

    if (faltante) {
      throw new NotFoundError(`${entidad} no encontrado: ${faltante}`);
    }
  }
}
