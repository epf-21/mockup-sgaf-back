import { NotFoundError } from '../../../../dominio/comun/errores/not-found.error';
import { Bien } from '../../../../dominio/bienes/entidades/bien.entity';
import type { BienRepository } from '../../ports/bien.repository';
import type { ReferenciasBienRepository } from '../../ports/referencias-bien.repository';
import type {
  ConstruirComponenteOutput,
  ConstruirPadreOutput,
  CrearBienOutput,
  NormalizarAtributosOutput,
} from './crear-bien.output';
import {
  EstadoBien,
  EstadoFisico,
  OrigenTipo,
  TipoDocumentoAdq,
} from '../../../../dominio/bienes/tipos/bien';
import type { CrearBienInput, CrearComponenteInput } from './crear-bien.input';
import type { CrearBienInputBoundary } from './crear-bien.input-boundary';

export class CrearBienUseCase implements CrearBienInputBoundary {
  constructor(
    private readonly bienes: BienRepository,
    private readonly referencias: ReferenciasBienRepository,
  ) {}

  async execute(input: CrearBienInput): Promise<CrearBienOutput> {
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

    const padre = this.construirPadre(input, codificador.id);

    const componentes: ConstruirComponenteOutput[] = [];
    for (const [index, componente] of (input.componentes ?? []).entries()) {
      componentes.push(
        await this.construirComponente(componente, index, {
          unidad_id: padre.unidad_id,
          responsable_id: padre.responsable_id,
          ubicacion: padre.ubicacion,
          adquisicion_nro_documento: padre.adquisicion_nro_documento,
          origen_nombre: padre.origen_nombre,
        }),
      );
    }

    return this.bienes.crearConComponentes(padre, componentes);
  }

  private construirPadre(
    input: CrearBienInput,
    codificadorId: string,
  ): ConstruirPadreOutput {
    const origenTipo = (input.tenencia ?? OrigenTipo.Propio) as OrigenTipo;
    const adquisicionTipo = (input.adquisicionTipoDocumento ??
      TipoDocumentoAdq.SinDocumento) as TipoDocumentoAdq;

    const bien = Bien.crear({
      descripcion: input.descripcion,
      responsableId: input.responsableId,
      origenTipo,
      patrimonial: input.patrimonial ?? false,
    });

    return {
      codificador_id: codificadorId,
      descripcion: bien.descripcion,
      unidad_id: input.unidadId,
      responsable_id: bien.responsableId,
      patrimonial: bien.patrimonial,
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
      atributos: this.normalizarAtributos(input.atributos),
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
    },
  ): Promise<ConstruirComponenteOutput> {
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
      atributos: this.normalizarAtributos(body.atributos),
    };
  }

  private normalizarAtributos(
    atributos: Record<string, unknown>,
  ): NormalizarAtributosOutput {
    const normalizados: NormalizarAtributosOutput = {};
    for (const [clave, valor] of Object.entries(atributos)) {
      if (valor === null || valor === undefined) continue;
      if (typeof valor === 'number' || typeof valor === 'boolean') {
        normalizados[clave] = valor;
      } else if (typeof valor === 'string') {
        normalizados[clave] = valor.trim();
      } else {
        normalizados[clave] = JSON.stringify(valor);
      }
    }
    return normalizados;
  }
}
