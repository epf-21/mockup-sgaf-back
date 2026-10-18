import {
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CrearProcesoBody {
  @IsUUID('4')
  tarea_id!: string;

  @IsUUID('4')
  tipo_proceso_id!: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  descripcion?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  bienes?: string[];

  @IsOptional()
  @IsUUID('4')
  unidad_origen_id?: string | null;

  @IsOptional()
  @IsUUID('4')
  unidad_destino_id?: string | null;

  @IsOptional()
  @IsUUID('4')
  ubicacion_origen_id?: string | null;

  @IsOptional()
  @IsUUID('4')
  ubicacion_destino_id?: string | null;

  @IsOptional()
  @IsUUID('4')
  responsable_origen_id?: string | null;

  @IsOptional()
  @IsUUID('4')
  responsable_destino_id?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  motivo?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  observaciones?: string | null;
}
