import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class AccionProcesoBody {
  @IsUUID('4')
  usuario_id!: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  observacion?: string | null;
}
