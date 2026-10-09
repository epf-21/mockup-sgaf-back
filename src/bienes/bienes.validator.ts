import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import type {
  estado_fisico,
  origen_tipo,
  tipo_documento_adq,
} from 'src/generated/prisma/enums';
import { PrismaService } from '../database/prisma.service';
import type { CrearBienBody, CrearComponenteBody } from './bienes.types';

export interface AtributoCatalogo {
  codigo: string;
  nombre: string;
  tipo_dato: string;
  unidad_medida?: string;
  obligatorio: boolean;
  orden: number;
}

export interface CodificadorCatalogo {
  codigo: string;
  atributos: AtributoCatalogo[];
}

export type BienCreateData = Omit<
  Prisma.bienUncheckedCreateInput,
  'id' | 'numero' | 'padre_id'
>;

export class BienValidator {
  constructor(private readonly prisma: PrismaService) {}

  async validateParent(body: CrearBienBody): Promise<BienCreateData> {
    const codificador = await this.getCodificador(body.codificador_id);
    const unidad = await this.getUnidad(body.unidad_id);
    await this.getPerson(body.responsable_id);
    const atributos = this.validateAttributes(
      body.atributos,
      codificador.codigo,
      'body',
    );
    const origenTipo = body.tenencia ?? 'propio';
    const adquisicionTipo = (body.adquisicion_tipo_documento ??
      this.documentTypeFromOrigin(body.procedencia)) as tipo_documento_adq;

    return {
      codificador_id: codificador.id,
      descripcion: body.descripcion.trim(),
      unidad_id: unidad.id,
      responsable_id: body.responsable_id,
      patrimonial:
        origenTipo === 'propio' ? (body.patrimonial ?? false) : false,
      valor_original: body.valor_original ?? null,
      estado: 'en_registro',
      estado_fisico_inicial: (body.estado_fisico ??
        null) as estado_fisico | null,
      estado_fisico: (body.estado_fisico ?? null) as estado_fisico | null,
      unidad_costo_id: unidad.id,
      fecha_alta: new Date(`${body.fecha_alta}T00:00:00.000Z`),
      adquisicion_tipo_documento: adquisicionTipo,
      adquisicion_nro_documento: body.adquisicion_nro_documento?.trim() || null,
      fecha_adquisicion: new Date(
        `${body.fecha_adquisicion ?? body.fecha_alta}T00:00:00.000Z`,
      ),
      origen_nombre: body.propietario_nombre?.trim() || null,
      origen_tipo: origenTipo as origen_tipo,
      ubicacion: body.ubicacion?.trim() || null,
      moneda: body.moneda?.toUpperCase() || 'BOB',
      procedencia: body.procedencia?.trim() || null,
      proveedor: body.proveedor?.trim() || null,
      atributos: JSON.stringify(atributos),
    };
  }

  async validateComponent(
    body: CrearComponenteBody,
    index: number,
    inheritance: {
      unidad_id: string;
      responsable_id: string;
      ubicacion: string | null;
    },
  ): Promise<BienCreateData> {
    const route = `componentes[${index}]`;
    const codificador = await this.getCodificador(body.codificador_id);
    const unidadId = body.unidad_id ?? inheritance.unidad_id;
    const unidad = await this.getUnidad(unidadId);
    const responsableId = body.responsable_id ?? inheritance.responsable_id;
    await this.getPerson(responsableId);
    const atributos = this.validateAttributes(
      body.atributos,
      codificador.codigo,
      route,
    );

    return {
      codificador_id: codificador.id,
      descripcion: body.descripcion.trim(),
      unidad_id: unidad.id,
      responsable_id: responsableId,
      patrimonial: false,
      valor_original: body.valor_original ?? null,
      estado: 'en_registro',
      estado_fisico_inicial: null,
      estado_fisico: null,
      unidad_costo_id: unidad.id,
      fecha_alta: new Date(),
      adquisicion_tipo_documento: 'sin_documento',
      adquisicion_nro_documento: null,
      fecha_adquisicion: new Date(),
      origen_nombre: null,
      origen_tipo: 'propio',
      ubicacion: body.ubicacion?.trim() || inheritance.ubicacion,
      moneda: body.moneda?.toUpperCase() || 'BOB',
      procedencia: null,
      proveedor: null,
      atributos: JSON.stringify(atributos),
    };
  }

  readCatalog(): Map<string, AtributoCatalogo[]> {
    const path = join(process.cwd(), 'prisma', 'catalogos', 'atributos.json');
    const catalog = JSON.parse(readFileSync(path, 'utf-8')) as {
      codificadores: CodificadorCatalogo[];
    };
    return new Map(catalog.codificadores.map((c) => [c.codigo, c.atributos]));
  }

  private async getCodificador(id: string) {
    const codificador = await this.prisma.codificador.findUnique({
      where: { id },
      select: { id: true, codigo: true },
    });
    if (!codificador) {
      throw new NotFoundException(`Codificador no encontrado: ${id}`);
    }
    return codificador;
  }

  private async getUnidad(id: string) {
    const unidad = await this.prisma.unidad_organizacional.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!unidad) {
      throw new NotFoundException(`Unidad no encontrada: ${id}`);
    }
    return unidad;
  }

  private async getPerson(id: string) {
    const person = await this.prisma.persona.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!person) {
      throw new NotFoundException(`Persona responsable no encontrada: ${id}`);
    }
    return person;
  }

  private validateAttributes(
    attributes: Record<string, unknown>,
    codificadorCodigo: string,
    route: string,
  ) {
    const definitions = this.readCatalog().get(codificadorCodigo);
    if (!definitions) {
      throw new BadRequestException(
        `No existe catálogo de atributos para el codificador ${codificadorCodigo}`,
      );
    }

    const allowed = new Map(
      definitions.map((attribute) => [attribute.codigo, attribute]),
    );
    for (const key of Object.keys(attributes)) {
      if (!allowed.has(key)) {
        throw new BadRequestException(
          `${route}.atributos.${key} no está permitido para el codificador ${codificadorCodigo}`,
        );
      }
    }

    const normalized: Record<string, string | number | boolean> = {};
    for (const definition of definitions) {
      const value = attributes[definition.codigo];
      if (definition.obligatorio && this.isEmpty(value)) {
        throw new BadRequestException(
          `${route}.atributos.${definition.codigo} es obligatorio`,
        );
      }
      if (this.isEmpty(value)) continue;
      normalized[definition.codigo] = this.normalizeAttribute(
        value,
        definition.tipo_dato,
        `${route}.atributos.${definition.codigo}`,
      );
    }
    return normalized;
  }

  private normalizeAttribute(value: unknown, type: string, route: string) {
    if (type === 'string' || type === 'date' || type === 'enum') {
      if (typeof value !== 'string' || !value.trim()) {
        throw new BadRequestException(`${route} debe ser texto`);
      }
      if (type === 'date' && !this.isValidDate(value)) {
        throw new BadRequestException(`${route} debe tener formato YYYY-MM-DD`);
      }
      if (
        type === 'enum' &&
        ![
          'excelente',
          'muy_bueno',
          'bueno',
          'regular',
          'malo',
          'chatarra',
        ].includes(value)
      ) {
        throw new BadRequestException(
          `${route} debe ser uno de los valores permitidos`,
        );
      }
      return value.trim();
    }
    if (type === 'number') {
      const number = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(number)) {
        throw new BadRequestException(`${route} debe ser un número válido`);
      }
      return number;
    }
    if (type === 'boolean') {
      if (typeof value === 'boolean') return value;
      if (value === 'true' || value === 'false') return value === 'true';
      throw new BadRequestException(`${route} debe ser booleano`);
    }
    throw new BadRequestException(`${route} tiene un tipo no soportado`);
  }

  private documentTypeFromOrigin(origin?: string | null) {
    const value = origin?.trim().toUpperCase();
    if (value === 'COMPRA') return 'factura' as const;
    if (value === 'DONACIÓN' || value === 'DONACION') {
      return 'acta_donacion' as const;
    }
    return 'sin_documento' as const;
  }

  private isValidDate(value: string) {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }

  private isEmpty(value: unknown) {
    return value === undefined || value === null || value === '';
  }
}
