export abstract class PersonaRepositoryPort {
  abstract listar(): Promise<{ id: string; nombre: string }[]>;
}
