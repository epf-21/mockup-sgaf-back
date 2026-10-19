import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class ProcesoSinBienesError extends BusinessRuleError {
  constructor() {
    super('El tipo de proceso requiere al menos un bien');
  }
}
