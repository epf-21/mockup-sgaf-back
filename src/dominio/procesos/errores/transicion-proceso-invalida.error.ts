import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class TransicionProcesoInvalidaError extends BusinessRuleError {
  constructor(mensaje: string) {
    super(mensaje);
  }
}
