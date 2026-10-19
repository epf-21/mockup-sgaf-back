import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class ProcesoCerradoError extends BusinessRuleError {
  constructor(codigo: string) {
    super(`El proceso ${codigo} ya está cerrado`);
  }
}
