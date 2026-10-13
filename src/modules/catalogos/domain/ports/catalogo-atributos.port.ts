import type { AtributoCatalogo } from '../types/atributo-catalogo';

export abstract class CatalogoAtributosPort {
  abstract obtenerTodos(): Promise<Map<string, AtributoCatalogo[]>>;
  abstract obtenerPorCodigo(codigo: string): Promise<AtributoCatalogo[] | null>;
}
