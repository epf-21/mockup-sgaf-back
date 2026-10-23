import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { EstadoProceso } from '../../../dominio/procesos/tipos/proceso';
import { CategoriaProceso } from '../../../dominio/tareas/tipos/tarea';

const CATEGORIAS = Object.values(CategoriaProceso);
const ESTADOS = Object.values(EstadoProceso);

export class ListarProcesosQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  por_pagina?: number;

  @IsOptional()
  @IsIn(CATEGORIAS)
  categoria?: CategoriaProceso;

  @IsOptional()
  @IsUUID()
  tipo_proceso_id?: string;

  @IsOptional()
  @IsIn(ESTADOS)
  estado?: EstadoProceso;

  @IsOptional()
  @IsUUID()
  unidad_destino_id?: string;
}
