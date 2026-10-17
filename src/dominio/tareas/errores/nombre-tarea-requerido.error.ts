import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class NombreTareaRequeridoError extends BusinessRuleError {
  constructor() {
    super(
      'El nombre de la tarea es obligatorio y debe tener entre 1 y 100 caracteres',
    );
  }
}
