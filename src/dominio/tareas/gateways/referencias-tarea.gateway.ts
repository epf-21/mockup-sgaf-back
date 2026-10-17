export abstract class ReferenciasTareaGateway {
  abstract usuariosExistentes(ids: string[]): Promise<string[]>;
}
