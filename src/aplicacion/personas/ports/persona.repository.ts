export abstract class PersonaRepository {
  abstract listar(): Promise<{ id: string; nombre: string }[]>;
}
