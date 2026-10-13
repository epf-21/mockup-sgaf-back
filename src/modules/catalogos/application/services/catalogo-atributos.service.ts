import { BusinessRuleError } from '../../../../shared/domain/errors/business-rule.error';
import type { CatalogoAtributosPort } from '../../domain/ports/catalogo-atributos.port';
import type { AtributoCatalogo } from '../../domain/types/atributo-catalogo';

export class CatalogoAtributosService {
  constructor(private readonly catalogo: CatalogoAtributosPort) {}

  async obtenerTodos(): Promise<Map<string, AtributoCatalogo[]>> {
    return this.catalogo.obtenerTodos();
  }

  async validarYNormalizar(
    atributos: Record<string, unknown>,
    codificadorCodigo: string,
    route: string,
  ): Promise<Record<string, string | number | boolean>> {
    const definitions = await this.catalogo.obtenerPorCodigo(codificadorCodigo);
    if (!definitions) {
      throw new BusinessRuleError(
        `No existe catálogo de atributos para el codificador ${codificadorCodigo}`,
      );
    }

    const allowed = new Map(
      definitions.map((attribute) => [attribute.codigo, attribute]),
    );
    for (const key of Object.keys(atributos)) {
      if (!allowed.has(key)) {
        throw new BusinessRuleError(
          `${route}.atributos.${key} no está permitido para el codificador ${codificadorCodigo}`,
        );
      }
    }

    const normalized: Record<string, string | number | boolean> = {};
    for (const definition of definitions) {
      const value = atributos[definition.codigo];
      if (definition.obligatorio && this.isEmpty(value)) {
        throw new BusinessRuleError(
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
    if (type === 'string' || type === 'date') {
      if (typeof value !== 'string' || !value.trim()) {
        throw new BusinessRuleError(`${route} debe ser texto`);
      }
      if (type === 'date' && !this.isValidDate(value)) {
        throw new BusinessRuleError(`${route} debe tener formato YYYY-MM-DD`);
      }
      return value.trim();
    }

    if (type === 'number') {
      const number = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(number)) {
        throw new BusinessRuleError(`${route} debe ser un número válido`);
      }
      return number;
    }
    throw new BusinessRuleError(`${route} tiene un tipo no soportado`);
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
