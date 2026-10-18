import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

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
}
