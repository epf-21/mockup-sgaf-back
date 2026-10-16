export abstract class ListarUnidadesInputBoundary {
  abstract execute(): Promise<{ id: string; nombre: string }[]>;
}
