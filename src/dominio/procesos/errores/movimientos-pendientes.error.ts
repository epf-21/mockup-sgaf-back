import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class MovimientosPendientesError extends BusinessRuleError {
  constructor() {
    super(
      'Todos los movimientos deben estar completados antes de cerrar el proceso',
    );
  }
}
