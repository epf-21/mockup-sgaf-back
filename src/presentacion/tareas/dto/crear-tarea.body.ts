import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import {
  CategoriaProceso,
  EstadoTarea,
} from '../../../dominio/tareas/tipos/tarea';

const CATEGORIAS = Object.values(CategoriaProceso);
const ESTADOS = Object.values(EstadoTarea);

export class CrearTareaBody {
  @IsString()
  @Length(1, 100)
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string | null;

  @IsIn(CATEGORIAS)
  categoria!: CategoriaProceso;

  @IsUUID('4')
  creado_por_id!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  gestion?: number;

  @IsIn(ESTADOS)
  estado!: EstadoTarea;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  supervisores?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  inventariadores?: string[];
}
