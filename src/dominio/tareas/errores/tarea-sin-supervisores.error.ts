import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class TareaSinSupervisoresError extends BusinessRuleError {
  constructor() {
    super('La tarea no tiene supervisores asignados');
  }
}
