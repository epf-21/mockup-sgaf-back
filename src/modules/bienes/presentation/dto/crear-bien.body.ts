import { Type, Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsBoolean,
  IsIn,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

const toNumber = ({ value }: { value: unknown }) => {
  if (value === null || value === undefined || value === '') return value;
  return typeof value === 'number' ? value : Number(value);
};

export class CrearComponenteBody {
  @IsUUID('4')
  codificador_id!: string;

  @IsString()
  @Length(1, 500)
  descripcion!: string;

  @IsObject()
  atributos!: Record<string, unknown>;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  valor_original?: number | null;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{3}$/)
  moneda?: string | null;

  @IsOptional()
  @IsUUID('4')
  unidad_id?: string | null;

  @IsOptional()
  @IsUUID('4')
  responsable_id?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  ubicacion?: string | null;

  @IsOptional()
  @IsBoolean()
  override?: boolean;
}

export class CrearBienBody {
  @IsUUID('4')
  codificador_id!: string;

  @IsString()
  @Length(1, 500)
  descripcion!: string;

  @IsObject()
  atributos!: Record<string, unknown>;

  @IsOptional()
  @IsIn(['excelente', 'muy_bueno', 'bueno', 'regular', 'malo'])
  estado_fisico?: string | null;

  @IsUUID('4')
  unidad_id!: string;

  @IsUUID('4')
  responsable_id!: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  ubicacion?: string | null;

  @IsOptional()
  @IsIn(['propio', 'alquiler', 'comodato', 'convenio', 'prestamo_recibido'])
  tenencia?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  propietario_nombre?: string | null;

  @IsOptional()
  @IsBoolean()
  patrimonial?: boolean;

  @IsISO8601({}, { message: 'debe tener formato YYYY-MM-DD' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'debe tener formato YYYY-MM-DD',
  })
  fecha_alta!: string;

  @IsOptional()
  @IsISO8601({}, { message: 'debe tener formato YYYY-MM-DD' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'debe tener formato YYYY-MM-DD',
  })
  fecha_adquisicion?: string;

  @IsOptional()
  @IsIn(['factura', 'acta_donacion', 'contrato', 'convenio', 'sin_documento'])
  adquisicion_tipo_documento?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  adquisicion_nro_documento?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  procedencia?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  proveedor?: string | null;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  valor_original?: number | null;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{3}$/)
  moneda?: string | null;

  @IsOptional()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CrearComponenteBody)
  componentes?: CrearComponenteBody[];
}
