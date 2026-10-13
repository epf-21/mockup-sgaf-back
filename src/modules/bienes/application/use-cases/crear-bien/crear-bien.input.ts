export interface CrearComponenteInput {
  codificadorId: string;
  descripcion: string;
  atributos: Record<string, unknown>;
  valorOriginal?: number | null;
  moneda?: string | null;
  unidadId?: string | null;
  responsableId?: string | null;
  ubicacion?: string | null;
}

export interface CrearBienInput {
  codificadorId: string;
  descripcion: string;
  atributos: Record<string, unknown>;
  estadoFisico?: string | null;
  unidadId: string;
  responsableId: string;
  ubicacion?: string | null;
  tenencia?: string;
  propietarioNombre?: string | null;
  patrimonial?: boolean;
  fechaAlta: string;
  fechaAdquisicion?: string;
  adquisicionTipoDocumento?: string;
  adquisicionNroDocumento?: string | null;
  procedencia?: string | null;
  proveedor?: string | null;
  valorOriginal?: number | null;
  moneda?: string | null;
  componentes?: CrearComponenteInput[];
}
