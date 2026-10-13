import { BusinessRuleError } from '../../../../../shared/domain/errors/business-rule.error';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import type { CatalogoAtributosService } from '../../../../catalogos/application/services/catalogo-atributos.service';
import type { BienRepositoryPort } from '../../../domain/ports/bien-repository.port';
import type { ReferenciasBienPort } from '../../../domain/ports/referencias-bien.port';
import type { BienCreado, NuevoBien } from '../../../domain/tipos/bien';
import {
  EstadoBien,
  EstadoFisico,
  OrigenTipo,
  TipoDocumentoAdq,
} from '../../../domain/tipos/bien';
import type { CrearBienInput, CrearComponenteInput } from './crear-bien.input';

export class CrearBienUseCase {
  constructor(
    private readonly bienes: BienRepositoryPort,
    private readonly referencias: ReferenciasBienPort,
    private readonly catalogoAtributos: CatalogoAtributosService,
  ) {}

  async execute(input: CrearBienInput): Promise<BienCreado> {
    const codificador = await this.referencias.codificadorExiste(
      input.codificadorId,
    );
    if (!codificador) {
      throw new NotFoundError(
        `Codificador no encontrado: ${input.codificadorId}`,
      );
    }

    if (!(await this.referencias.unidadExiste(input.unidadId))) {
      throw new NotFoundError(`Unidad no encontrada: ${input.unidadId}`);
    }

    if (!(await this.referencias.personaExiste(input.responsableId))) {
      throw new NotFoundError(
        `Persona responsable no encontrada: ${input.responsableId}`,
      );
    }

    const atributos = await this.catalogoAtributos.validarYNormalizar(
      input.atributos,
      codificador.codigo,
      'body',
    );

    const padre = this.construirPadre(input, codificador.id, atributos);

    const componentes: NuevoBien[] = [];
    for (const [index, componente] of (input.componentes ?? []).entries()) {
      componentes.push(
        await this.construirComponente(componente, index, {
          unidad_id: padre.unidad_id,
          responsable_id: padre.responsable_id,
          ubicacion: padre.ubicacion,
          adquisicion_nro_documento: padre.adquisicion_nro_documento,
          origen_nombre: padre.origen_nombre,
          procedencia: padre.procedencia,
          proveedor: padre.proveedor,
        }),
      );
    }

    return this.bienes.crearConComponentes(padre, componentes);
  }

  private construirPadre(
    input: CrearBienInput,
    codificadorId: string,
    atributos: Record<string, string | number | boolean>,
  ): NuevoBien {
    const origenTipo = (input.tenencia ?? OrigenTipo.Propio) as OrigenTipo;
    const adquisicionTipo = (input.adquisicionTipoDocumento ??
      this.documentTypeFromOrigin(input.procedencia)) as TipoDocumentoAdq;

    return {
      codificador_id: codificadorId,
      descripcion: input.descripcion.trim(),
      unidad_id: input.unidadId,
      responsable_id: input.responsableId,
      patrimonial:
        origenTipo === OrigenTipo.Propio ? (input.patrimonial ?? false) : false,
      valor_original: input.valorOriginal ?? null,
      estado: EstadoBien.EnRegistro,
      estado_fisico_inicial: (input.estadoFisico ??
        null) as EstadoFisico | null,
      estado_fisico: (input.estadoFisico ?? null) as EstadoFisico | null,
      unidad_costo_id: input.unidadId,
      fecha_alta: new Date(`${input.fechaAlta}T00:00:00.000Z`),
      adquisicion_tipo_documento: adquisicionTipo,
      adquisicion_nro_documento: input.adquisicionNroDocumento?.trim() || null,
      fecha_adquisicion: new Date(
        `${input.fechaAdquisicion ?? input.fechaAlta}T00:00:00.000Z`,
      ),
      origen_nombre: input.propietarioNombre?.trim() || null,
      origen_tipo: origenTipo,
      ubicacion: input.ubicacion?.trim() || null,
      moneda: input.moneda?.toUpperCase() || 'BOB',
      procedencia: input.procedencia?.trim() || null,
      proveedor: input.proveedor?.trim() || null,
      atributos: JSON.stringify(atributos),
    };
  }

  private async construirComponente(
    body: CrearComponenteInput,
    index: number,
    inheritance: {
      unidad_id: string;
      responsable_id: string;
      ubicacion: string | null;
      adquisicion_nro_documento: string | null;
      origen_nombre: string | null;
      procedencia: string | null;
      proveedor: string | null;
    },
  ): Promise<NuevoBien> {
    const route = `componentes[${index}]`;

    const codificador = await this.referencias.codificadorExiste(
      body.codificadorId,
    );
    if (!codificador) {
      throw new NotFoundError(
        `Codificador no encontrado: ${body.codificadorId}`,
      );
    }

    const unidadId = body.unidadId ?? inheritance.unidad_id;
    if (!(await this.referencias.unidadExiste(unidadId))) {
      throw new NotFoundError(`Unidad no encontrada: ${unidadId}`);
    }

    const responsableId = body.responsableId ?? inheritance.responsable_id;
    if (!(await this.referencias.personaExiste(responsableId))) {
      throw new NotFoundError(
        `Persona responsable no encontrada: ${responsableId}`,
      );
    }

    const atributos = await this.catalogoAtributos.validarYNormalizar(
      body.atributos,
      codificador.codigo,
      route,
    );

    return {
      codificador_id: codificador.id,
      descripcion: body.descripcion.trim(),
      unidad_id: unidadId,
      responsable_id: responsableId,
      patrimonial: false,
      valor_original: body.valorOriginal ?? null,
      estado: EstadoBien.EnRegistro,
      estado_fisico_inicial: null,
      estado_fisico: null,
      unidad_costo_id: unidadId,
      fecha_alta: new Date(),
      adquisicion_tipo_documento: TipoDocumentoAdq.SinDocumento,
      adquisicion_nro_documento: inheritance.adquisicion_nro_documento ?? '',
      fecha_adquisicion: new Date(),
      origen_nombre: inheritance.origen_nombre,
      origen_tipo: OrigenTipo.Propio,
      ubicacion: inheritance.ubicacion,
      moneda: body.moneda?.toUpperCase() || 'BOB',
      procedencia: inheritance.procedencia,
      proveedor: inheritance.proveedor,
      atributos: JSON.stringify(atributos),
    };
  }

  private documentTypeFromOrigin(origin?: string | null) {
    const value = origin?.trim().toUpperCase();
    if (value === 'COMPRA') return TipoDocumentoAdq.Factura;
    if (value === 'DONACIÓN' || value === 'DONACION') {
      return TipoDocumentoAdq.ActaDonacion;
    }
    return TipoDocumentoAdq.SinDocumento;
  }
}

export { BusinessRuleError };
