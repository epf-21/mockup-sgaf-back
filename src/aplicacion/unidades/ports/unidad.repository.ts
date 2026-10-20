export abstract class UnidadRepository {
  abstract listar(): Promise<{ id: string; nombre: string }[]>;
}
