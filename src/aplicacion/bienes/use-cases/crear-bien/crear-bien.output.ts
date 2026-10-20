import type {
  AtributosBien,
  NuevoBien,
} from '../../../../dominio/bienes/tipos/bien';

export interface CrearBienComponenteOutput {
  id: string;
  numero: number;
  descripcion: string;
}

export interface CrearBienOutput {
  id: string;
  numero: number;
  descripcion: string;
  componentes: CrearBienComponenteOutput[];
}

export type ConstruirPadreOutput = NuevoBien;
export type ConstruirComponenteOutput = NuevoBien;
export type NormalizarAtributosOutput = AtributosBien;
