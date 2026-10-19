import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class ProcesoSinMovimientosError extends BusinessRuleError {
  constructor() {
    super('El proceso no tiene movimientos para completar');
  }
}
