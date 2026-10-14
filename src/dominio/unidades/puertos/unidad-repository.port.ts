export abstract class UnidadRepositoryPort {
  abstract listar(): Promise<{ id: string; nombre: string }[]>;
}
