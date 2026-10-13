import type { CatalogoAtributosService } from '../services/catalogo-atributos.service';
import type { CodificadorRepositoryPort } from '../../domain/ports/codificador-repository.port';

export class AtributosPorCodificadorUseCase {
  constructor(
    private readonly repositorio: CodificadorRepositoryPort,
    private readonly catalogoAtributos: CatalogoAtributosService,
  ) {}

  async execute() {
    const codificadores = await this.repositorio.listarResumen();
    const atributosPorCodigo = await this.catalogoAtributos.obtenerTodos();

    return codificadores.map((c) => ({
      id: c.id,
      codigo: c.codigo,
      atributos: atributosPorCodigo.get(c.codigo) ?? [],
    }));
  }
}
