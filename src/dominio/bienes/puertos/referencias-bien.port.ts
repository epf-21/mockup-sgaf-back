export abstract class ReferenciasBienPort {
  abstract codificadorExiste(
    id: string,
  ): Promise<{ id: string; codigo: string } | null>;
  abstract unidadExiste(id: string): Promise<boolean>;
  abstract personaExiste(id: string): Promise<boolean>;
}
