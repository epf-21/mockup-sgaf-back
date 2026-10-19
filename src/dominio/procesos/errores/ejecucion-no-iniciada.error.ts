import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class EjecucionNoIniciadaError extends BusinessRuleError {
  constructor() {
    super('La ejecución del proceso no ha sido iniciada');
  }
}
