import { EjecucionNoIniciadaError } from '../errores/ejecucion-no-iniciada.error';
import { MovimientoNoEncontradoError } from '../errores/movimiento-no-encontrado.error';
import { MovimientosPendientesError } from '../errores/movimientos-pendientes.error';
import { ObservacionRequeridaError } from '../errores/observacion-requerida.error';
import { ProcesoCerradoError } from '../errores/proceso-cerrado.error';
import { ProcesoSinMovimientosError } from '../errores/proceso-sin-movimientos.error';
import { TransicionProcesoInvalidaError } from '../errores/transicion-proceso-invalida.error';
import {
  CambiosProceso,
  DatosProcesoWorkflow,
  EfectoBien,
  EstadoMovimiento,
  EstadoProceso,
} from '../tipos/proceso';

const agregarObservacion = (actual: string | null, nueva: string): string =>
  actual?.trim() ? `${actual.trim()}\n${nueva}` : nueva;

export class ProcesoWorkflow {
  private constructor(private readonly datos: DatosProcesoWorkflow) {}

  static desde(datos: DatosProcesoWorkflow): ProcesoWorkflow {
    return new ProcesoWorkflow(datos);
  }

  get id(): string {
    return this.datos.id;
  }

  get estaCerrado(): boolean {
    return this.datos.estado === EstadoProceso.Cerrado;
  }

  autorizar(
    usuarioId: string,
    fecha: Date,
    observacion: string | null,
  ): CambiosProceso {
    this.validarNoCerrado();

    if (!this.datos.tipo.requiere_autorizacion) {
      throw new TransicionProcesoInvalidaError(
        'El tipo de proceso no requiere autorización',
      );
    }

    if (this.datos.estado !== EstadoProceso.Pendiente) {
      throw new TransicionProcesoInvalidaError(
        'Solo se puede autorizar un proceso pendiente',
      );
    }

    if (this.datos.autorizado_por_id) {
      throw new TransicionProcesoInvalidaError('El proceso ya fue autorizado');
    }

    const tieneMovimientos = this.datos.movimientos.length > 0;
    const estado =
      this.datos.tipo.genera_movimiento ||
      this.datos.tipo.requiere_ejecucion_campo
        ? EstadoProceso.Pendiente
        : EstadoProceso.Procesado;

    return {
      estado,
      autorizado_por_id: usuarioId,
      fecha_autorizacion: fecha,
      observaciones: observacion?.trim()
        ? agregarObservacion(
            this.datos.observaciones,
            `Autorización: ${observacion.trim()}`,
          )
        : undefined,
      movimientos: tieneMovimientos
        ? {
            desde: [EstadoMovimiento.Solicitud],
            hacia: EstadoMovimiento.Autorizado,
          }
        : undefined,
      efectos_bienes: [],
    };
  }

  rechazar(
    usuarioId: string,
    fecha: Date,
    observacion: string | null,
  ): CambiosProceso {
    this.validarNoCerrado();

    if (!this.datos.tipo.requiere_autorizacion) {
      throw new TransicionProcesoInvalidaError(
        'El tipo de proceso no requiere autorización',
      );
    }

    if (this.datos.estado !== EstadoProceso.Pendiente) {
      throw new TransicionProcesoInvalidaError(
        'Solo se puede rechazar un proceso pendiente',
      );
    }

    if (this.datos.autorizado_por_id) {
      throw new TransicionProcesoInvalidaError(
        'No se puede rechazar un proceso ya autorizado',
      );
    }

    if (!observacion?.trim()) {
      throw new ObservacionRequeridaError('rechazar el proceso');
    }

    return {
      estado: EstadoProceso.Cerrado,
      cerrado_por_id: usuarioId,
      fecha_cierre: fecha,
      observaciones: agregarObservacion(
        this.datos.observaciones,
        `Rechazo: ${observacion.trim()}`,
      ),
      efectos_bienes: [],
    };
  }

  iniciarEjecucion(observacion: string | null): CambiosProceso {
    this.validarNoCerrado();

    if (!this.datos.tipo.requiere_ejecucion_campo) {
      throw new TransicionProcesoInvalidaError(
        'El tipo de proceso no requiere ejecución en campo',
      );
    }

    if (this.datos.estado !== EstadoProceso.Pendiente) {
      throw new TransicionProcesoInvalidaError(
        'Solo se puede iniciar la ejecución de un proceso pendiente',
      );
    }

    this.validarAutorizacionPrevia();

    if (this.datos.movimientos.length === 0) {
      throw new ProcesoSinMovimientosError();
    }

    if (
      this.datos.movimientos.some(
        (movimiento) => movimiento.estado === EstadoMovimiento.Aceptacion,
      )
    ) {
      throw new TransicionProcesoInvalidaError(
        'La ejecución ya fue completada',
      );
    }

    if (
      this.datos.movimientos.some(
        (movimiento) => movimiento.estado === EstadoMovimiento.Ejecucion,
      )
    ) {
      throw new TransicionProcesoInvalidaError('La ejecución ya fue iniciada');
    }

    return {
      estado: EstadoProceso.Pendiente,
      observaciones: observacion?.trim()
        ? agregarObservacion(
            this.datos.observaciones,
            `Ejecución: ${observacion.trim()}`,
          )
        : undefined,
      movimientos: {
        desde: [EstadoMovimiento.Solicitud, EstadoMovimiento.Autorizado],
        hacia: EstadoMovimiento.Ejecucion,
      },
      efectos_bienes: [],
    };
  }

  completarMovimiento(
    movimientoId: string,
    observacion: string | null,
  ): CambiosProceso {
    this.validarNoCerrado();

    if (!this.datos.tipo.genera_movimiento) {
      throw new TransicionProcesoInvalidaError(
        'El proceso no genera movimientos',
      );
    }

    if (this.datos.estado !== EstadoProceso.Pendiente) {
      throw new TransicionProcesoInvalidaError(
        'Solo se pueden completar movimientos de un proceso pendiente',
      );
    }

    this.validarAutorizacionPrevia();

    const movimiento = this.datos.movimientos.find(
      (actual) => actual.id === movimientoId,
    );
    if (!movimiento) {
      throw new MovimientoNoEncontradoError(movimientoId);
    }

    if (movimiento.estado === EstadoMovimiento.Aceptacion) {
      throw new TransicionProcesoInvalidaError(
        'El movimiento ya está completado',
      );
    }

    if (this.datos.tipo.requiere_ejecucion_campo) {
      if (movimiento.estado !== EstadoMovimiento.Ejecucion) {
        throw new EjecucionNoIniciadaError();
      }
    } else if (
      movimiento.estado !== EstadoMovimiento.Solicitud &&
      movimiento.estado !== EstadoMovimiento.Autorizado
    ) {
      throw new TransicionProcesoInvalidaError(
        'El movimiento no está listo para completarse',
      );
    }

    const todosCompletados = this.datos.movimientos.every(
      (actual) =>
        actual.id === movimientoId ||
        actual.estado === EstadoMovimiento.Aceptacion,
    );

    const nota = observacion?.trim()
      ? `Completado: ${observacion.trim()}`
      : 'Completado';

    return {
      estado: todosCompletados
        ? EstadoProceso.Procesado
        : EstadoProceso.Pendiente,
      movimiento_completado_id: movimientoId,
      observacion_movimiento: agregarObservacion(
        movimiento.observaciones,
        nota,
      ),
      efectos_bienes: [],
    };
  }

  cerrar(
    usuarioId: string,
    fecha: Date,
    observacion: string | null,
  ): CambiosProceso {
    this.validarNoCerrado();

    if (this.datos.tipo.genera_movimiento) {
      if (this.datos.movimientos.length === 0) {
        throw new ProcesoSinMovimientosError();
      }

      if (
        !this.datos.movimientos.every(
          (movimiento) => movimiento.estado === EstadoMovimiento.Aceptacion,
        )
      ) {
        throw new MovimientosPendientesError();
      }
    }

    if (this.datos.estado !== EstadoProceso.Procesado) {
      throw new TransicionProcesoInvalidaError(
        'El proceso debe estar procesado para poder cerrarse',
      );
    }

    return {
      estado: EstadoProceso.Cerrado,
      cerrado_por_id: usuarioId,
      fecha_cierre: fecha,
      observaciones: observacion?.trim()
        ? agregarObservacion(
            this.datos.observaciones,
            `Cierre: ${observacion.trim()}`,
          )
        : undefined,
      efectos_bienes: this.calcularEfectosBienes(fecha),
    };
  }

  private validarNoCerrado(): void {
    if (this.estaCerrado) {
      throw new ProcesoCerradoError(this.datos.codigo);
    }
  }

  private validarAutorizacionPrevia(): void {
    if (
      this.datos.tipo.requiere_autorizacion &&
      !this.datos.autorizado_por_id
    ) {
      throw new TransicionProcesoInvalidaError(
        'El proceso debe ser autorizado antes de continuar',
      );
    }
  }

  private calcularEfectosBienes(fecha: Date): EfectoBien[] {
    const efectos: EfectoBien[] = [];

    for (const movimiento of this.datos.movimientos) {
      const efecto: EfectoBien = { bien_id: movimiento.bien_id };
      let cambia = false;

      if (this.datos.tipo.categoria === 'baja') {
        efecto.estado = 'baja';
        efecto.fecha_baja = fecha;
        efecto.motivo_baja =
          this.datos.descripcion?.trim() ||
          movimiento.motivo?.trim() ||
          'Baja de bien';
        cambia = true;
      } else if (this.datos.tipo.categoria === 'alta') {
        efecto.estado = 'activo';
        cambia = true;
      }

      if (this.datos.tipo.categoria !== 'baja') {
        if (movimiento.unidad_destino_id) {
          efecto.unidad_id = movimiento.unidad_destino_id;
          efecto.unidad_costo_id = movimiento.unidad_destino_id;
          cambia = true;
        }
        if (movimiento.ubicacion_destino_id) {
          efecto.ubicacion_id = movimiento.ubicacion_destino_id;
          cambia = true;
        }
        if (movimiento.responsable_destino_id) {
          efecto.responsable_id = movimiento.responsable_destino_id;
          cambia = true;
        }
      }

      if (cambia) {
        efectos.push(efecto);
      }
    }

    return efectos;
  }
}
