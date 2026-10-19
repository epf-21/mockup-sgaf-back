import { ProcesoWorkflow } from '../../../dominio/procesos/entidades/proceso-workflow.entity';
import { MovimientoNoEncontradoError } from '../../../dominio/procesos/errores/movimiento-no-encontrado.error';
import { ProcesoNoEncontradoError } from '../../../dominio/procesos/errores/proceso-no-encontrado.error';
import { RolNoAutorizadoError } from '../../../dominio/procesos/errores/rol-no-autorizado.error';
import { UsuarioNoEncontradoError } from '../../../dominio/comun/errores/usuario-no-encontrado.error';
import type { ProcesoGateway } from '../../../dominio/procesos/gateways/proceso.gateway';
import type { ReferenciasProcesoGateway } from '../../../dominio/procesos/gateways/referencias-proceso.gateway';
import {
  ROLES_EJECUCION,
  type DatosUsuarioProceso,
  type ProcesoDetalle,
} from '../../../dominio/procesos/tipos/proceso';
import type { CompletarMovimientoInput } from './completar-movimiento.input';
import type { CompletarMovimientoInputBoundary } from './completar-movimiento.input-boundary';

export class CompletarMovimientoUseCase implements CompletarMovimientoInputBoundary {
  constructor(
    private readonly procesos: ProcesoGateway,
    private readonly referencias: ReferenciasProcesoGateway,
  ) {}

  async execute(input: CompletarMovimientoInput): Promise<ProcesoDetalle> {
    const workflow = await this.procesos.obtenerWorkflowPorMovimiento(
      input.movimientoId,
    );
    if (!workflow) {
      throw new MovimientoNoEncontradoError(input.movimientoId);
    }

    const usuario = await this.referencias.usuarioExiste(input.usuarioId);
    if (!usuario) {
      throw new UsuarioNoEncontradoError(input.usuarioId);
    }

    this.validarRol(usuario);

    const proceso = ProcesoWorkflow.desde(workflow);
    const cambios = proceso.completarMovimiento(
      input.movimientoId,
      input.observacion,
    );

    await this.procesos.aplicarTransicion(workflow.id, cambios);

    const detalle = await this.procesos.obtenerDetalle(workflow.id);
    if (!detalle) {
      throw new ProcesoNoEncontradoError(workflow.id);
    }

    return detalle;
  }

  private validarRol(usuario: DatosUsuarioProceso): void {
    if (!usuario.activo || !ROLES_EJECUCION.includes(usuario.rol)) {
      throw new RolNoAutorizadoError(usuario.rol, 'completar el movimiento');
    }
  }
}
