import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class ListarBienesQuery {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsUUID()
  codificador_id?: string;

  @IsOptional()
  @IsString()
  atributos?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  por_pagina?: number = 10;
}
