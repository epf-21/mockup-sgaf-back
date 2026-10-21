import { ListarUnidadesOutput } from '../output/listar-unidades.output';

export abstract class UnidadRepository {
  abstract listar(): Promise<ListarUnidadesOutput[]>;
}
