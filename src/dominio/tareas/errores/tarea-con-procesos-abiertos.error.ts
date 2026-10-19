import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class TareaConProcesosAbiertosError extends BusinessRuleError {
  constructor(codigos: string[]) {
    super(`La tarea tiene procesos abiertos: ${codigos.join(', ')}`);
  }
}
