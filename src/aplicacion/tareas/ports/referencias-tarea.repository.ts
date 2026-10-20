import type { DatosUsuarioTarea } from '../../../dominio/tareas/tipos/tarea';

export abstract class ReferenciasTareaRepository {
  abstract usuariosExistentes(ids: string[]): Promise<string[]>;
  abstract usuarioExiste(id: string): Promise<DatosUsuarioTarea | null>;
}
