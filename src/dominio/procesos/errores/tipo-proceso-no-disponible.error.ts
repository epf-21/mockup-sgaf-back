import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class TipoProcesoNoDisponibleError extends BusinessRuleError {
  constructor(nombre: string, categoria: string) {
    super(
      `El tipo de proceso "${nombre}" no está disponible para la categoría "${categoria}"`,
    );
  }
}
