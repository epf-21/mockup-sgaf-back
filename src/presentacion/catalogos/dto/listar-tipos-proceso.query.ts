import { IsIn, IsOptional } from 'class-validator';
import { CategoriaProceso } from '../../../dominio/tareas/tipos/tarea';

const CATEGORIAS = Object.values(CategoriaProceso);

export class ListarTiposProcesoQuery {
  @IsOptional()
  @IsIn(CATEGORIAS)
  categoria?: CategoriaProceso;
}
