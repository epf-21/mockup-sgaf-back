import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Injectable } from '@nestjs/common';
import type { CatalogoAtributosPort } from '../domain/ports/catalogo-atributos.port';
import type {
  AtributoCatalogo,
  CodificadorCatalogo,
} from '../domain/types/atributo-catalogo';

@Injectable()
export class ArchivoAtributosCatalogo implements CatalogoAtributosPort {
  obtenerTodos(): Promise<Map<string, AtributoCatalogo[]>> {
    const path = join(process.cwd(), 'prisma', 'catalogos', 'atributos.json');
    const catalog = JSON.parse(readFileSync(path, 'utf-8')) as {
      codificadores: CodificadorCatalogo[];
    };
    return Promise.resolve(
      new Map(catalog.codificadores.map((c) => [c.codigo, c.atributos])),
    );
  }

  async obtenerPorCodigo(codigo: string): Promise<AtributoCatalogo[] | null> {
    const todos = await this.obtenerTodos();
    return todos.get(codigo) ?? null;
  }
}
