import { ProcesoWorkflow } from '../../../../dominio/procesos/entidades/proceso-workflow.entity';
import { ProcesoNoEncontradoError } from '../../../../dominio/procesos/errores/proceso-no-encontrado.error';
import { RolNoAutorizadoError } from '../../../../dominio/procesos/errores/rol-no-autorizado.error';
import { TransicionProcesoInvalidaError } from '../../../../dominio/procesos/errores/transicion-proceso-invalida.error';
import { UsuarioNoEncontradoError } from '../../../../dominio/comun/errores/usuario-no-encontrado.error';
import type { ProcesoRepository } from '../../ports/proceso.repository';
import type { ReferenciasProcesoRepository } from '../../ports/referencias-proceso.repository';
import {
  AccionProceso,
  ROLES_AUTORIZACION,
  ROLES_CIERRE_PROCESO,
  ROLES_EJECUCION,
  type CambiosProceso,
  type DatosUsuarioProceso,
} from '../../../../dominio/procesos/tipos/proceso';
import type { TransicionarProcesoOutput } from './transicionar-proceso.output';
import type { Reloj } from '../../../comun/ports/reloj.port';
import type { TransicionarProcesoInput } from './transicionar-proceso.input';
import type { TransicionarProcesoInputBoundary } from './transicionar-proceso.input-boundary';

export class TransicionarProcesoUseCase implements TransicionarProcesoInputBoundary {
  constructor(
    private readonly procesos: ProcesoRepository,
    private readonly referencias: ReferenciasProcesoRepository,
    private readonly reloj: Reloj,
  ) {}

  async execute(
    input: TransicionarProcesoInput,
  ): Promise<TransicionarProcesoOutput> {
    const workflow = await this.procesos.obtenerWorkflow(input.procesoId);
    if (!workflow) {
      throw new ProcesoNoEncontradoError(input.procesoId);
    }

    const usuario = await this.referencias.usuarioExiste(input.usuarioId);
    if (!usuario) {
      throw new UsuarioNoEncontradoError(input.usuarioId);
    }

    const fecha = this.reloj.ahora();
    const proceso = ProcesoWorkflow.desde(workflow);

    let cambios: CambiosProceso;

    switch (input.accion) {
      case AccionProceso.Autorizar:
        this.validarRol(usuario, ROLES_AUTORIZACION, 'autorizar el proceso');
        cambios = proceso.autorizar(input.usuarioId, fecha, input.observacion);
        break;

      case AccionProceso.Rechazar:
        this.validarRol(usuario, ROLES_AUTORIZACION, 'rechazar el proceso');
        cambios = proceso.rechazar(input.usuarioId, fecha, input.observacion);
        break;

      case AccionProceso.IniciarEjecucion:
        this.validarRol(usuario, ROLES_EJECUCION, 'iniciar la ejecución');
        cambios = proceso.iniciarEjecucion(input.observacion);
        break;

      case AccionProceso.Cerrar:
        this.validarRol(usuario, ROLES_CIERRE_PROCESO, 'cerrar el proceso');
        cambios = proceso.cerrar(input.usuarioId, fecha, input.observacion);
        break;

      default:
        throw new TransicionProcesoInvalidaError(
          `La acción "${input.accion}" no está soportada`,
        );
    }

    await this.procesos.aplicarTransicion(input.procesoId, cambios);

    const detalle = await this.procesos.obtenerDetalle(input.procesoId);
    if (!detalle) {
      throw new ProcesoNoEncontradoError(input.procesoId);
    }

    return detalle;
  }

  private validarRol(
    usuario: DatosUsuarioProceso,
    roles: readonly string[],
    accion: string,
  ): void {
    if (!usuario.activo || !roles.includes(usuario.rol)) {
      throw new RolNoAutorizadoError(usuario.rol, accion);
    }
  }
}
