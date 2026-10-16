export abstract class PersonaGateway {
  abstract listar(): Promise<{ id: string; nombre: string }[]>;
}
