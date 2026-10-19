import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class RolNoAutorizadoError extends BusinessRuleError {
  constructor(rol: string, accion: string) {
    super(`El rol "${rol}" no puede realizar la acción "${accion}"`);
  }
}
