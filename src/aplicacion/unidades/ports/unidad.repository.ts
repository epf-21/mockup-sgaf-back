import { ListarUnidadesOutput } from '../use-cases/listar-unidades/listar-unidades.output';

export abstract class UnidadRepository {
  abstract listar(): Promise<ListarUnidadesOutput[]>;
}
