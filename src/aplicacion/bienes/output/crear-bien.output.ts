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
