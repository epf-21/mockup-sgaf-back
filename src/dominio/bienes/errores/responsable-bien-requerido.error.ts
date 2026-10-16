import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class ResponsableBienRequeridoError extends BusinessRuleError {
  constructor() {
    super('El bien debe tener un responsable asignado');
  }
}
