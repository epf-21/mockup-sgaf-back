import type { DatosTareaProceso, DatosTipoProceso } from '../tipos/proceso';

export abstract class ReferenciasProcesoGateway {
  abstract tareaExiste(id: string): Promise<DatosTareaProceso | null>;
  abstract tipoProcesoExiste(id: string): Promise<DatosTipoProceso | null>;
  abstract bienExiste(id: string): Promise<boolean>;
  abstract unidadExiste(id: string): Promise<boolean>;
  abstract ubicacionExiste(id: string): Promise<boolean>;
  abstract personaExiste(id: string): Promise<boolean>;
}
