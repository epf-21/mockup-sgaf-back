import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class ObservacionRequeridaError extends BusinessRuleError {
  constructor(accion: string) {
    super(`La observación es obligatoria para ${accion}`);
  }
}
