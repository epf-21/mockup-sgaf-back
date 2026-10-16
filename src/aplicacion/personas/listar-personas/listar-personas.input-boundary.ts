export abstract class ListarPersonasInputBoundary {
  abstract execute(): Promise<{ id: string; nombre: string }[]>;
}
