import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class TareaYaCerradaError extends BusinessRuleError {
  constructor() {
    super('La tarea ya está cerrada o cancelada');
  }
}
