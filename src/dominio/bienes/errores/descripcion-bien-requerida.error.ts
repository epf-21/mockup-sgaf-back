import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class DescripcionBienRequeridaError extends BusinessRuleError {
  constructor() {
    super('La descripción del bien es obligatoria');
  }
}
