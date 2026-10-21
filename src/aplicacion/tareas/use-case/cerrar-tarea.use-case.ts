import { UsuarioNoEncontradoError } from '../../../dominio/comun/errores/usuario-no-encontrado.error';
import type { Reloj } from '../../comun/ports/reloj.port';
import { RolTareaNoAutorizadoError } from '../../../dominio/tareas/errores/rol-tarea-no-autorizado.error';
import { TareaConProcesosAbiertosError } from '../../../dominio/tareas/errores/tarea-con-procesos-abiertos.error';
import { TareaNoEncontradaError } from '../../../dominio/tareas/errores/tarea-no-encontrada.error';
import { TareaSinSupervisoresError } from '../../../dominio/tareas/errores/tarea-sin-supervisores.error';
import { TareaYaCerradaError } from '../../../dominio/tareas/errores/tarea-ya-cerrada.error';
import type { ReferenciasTareaRepository } from '../ports/referencias-tarea.repository';
import type { TareaRepository } from '../ports/tarea.repository';
import { ROLES_CIERRE_TAREA, type DatosUsuarioTarea } from '../tipos/tarea';
import type { CerrarTareaOutput } from '../output/cerrar-tarea.output';
import type { CerrarTareaInput } from '../input/cerrar-tarea.input';
import type { CerrarTareaInputBoundary } from '../input-boundary/cerrar-tarea.input-boundary';

export class CerrarTareaUseCase implements CerrarTareaInputBoundary {
  constructor(
    private readonly tareas: TareaRepository,
    private readonly referencias: ReferenciasTareaRepository,
    private readonly reloj: Reloj,
  ) {}

  async execute(input: CerrarTareaInput): Promise<CerrarTareaOutput> {
    const tarea = await this.tareas.obtenerDetalle(input.tareaId);
    if (!tarea) {
      throw new TareaNoEncontradaError(input.tareaId);
    }

    const usuario = await this.referencias.usuarioExiste(input.usuarioId);
    if (!usuario) {
      throw new UsuarioNoEncontradoError(input.usuarioId);
    }

    this.validarRol(usuario);

    if (tarea.estado === 'cerrada' || tarea.estado === 'cancelada') {
      throw new TareaYaCerradaError();
    }

    if (tarea.supervisores.length === 0) {
      throw new TareaSinSupervisoresError();
    }

    const abiertos = tarea.procesos.filter(
      (proceso) => proceso.estado !== 'cerrado',
    );
    if (abiertos.length > 0) {
      throw new TareaConProcesosAbiertosError(
        abiertos.map((proceso) => proceso.codigo ?? proceso.id),
      );
    }

    await this.tareas.cerrar(input.tareaId, this.reloj.ahora());

    const actualizada = await this.tareas.obtenerDetalle(input.tareaId);
    if (!actualizada) {
      throw new TareaNoEncontradaError(input.tareaId);
    }

    return actualizada;
  }

  private validarRol(usuario: DatosUsuarioTarea): void {
    if (!usuario.activo || !ROLES_CIERRE_TAREA.includes(usuario.rol)) {
      throw new RolTareaNoAutorizadoError(usuario.rol, 'cerrar la tarea');
    }
  }
}
