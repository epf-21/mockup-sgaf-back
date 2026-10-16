export abstract class UnidadGateway {
  abstract listar(): Promise<{ id: string; nombre: string }[]>;
}
