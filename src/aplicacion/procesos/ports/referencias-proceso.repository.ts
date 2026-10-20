import type {
  DatosTareaProceso,
  DatosTipoProceso,
} from '../../../dominio/procesos/tipos/proceso';
import type { DatosUsuarioProceso } from '../tipos/proceso';

export abstract class ReferenciasProcesoRepository {
  abstract tareaExiste(id: string): Promise<DatosTareaProceso | null>;
  abstract tipoProcesoExiste(id: string): Promise<DatosTipoProceso | null>;
  abstract usuarioExiste(id: string): Promise<DatosUsuarioProceso | null>;
  abstract bienExiste(id: string): Promise<boolean>;
  abstract unidadExiste(id: string): Promise<boolean>;
  abstract ubicacionExiste(id: string): Promise<boolean>;
  abstract personaExiste(id: string): Promise<boolean>;
}
