export interface CrearProcesoInput {
  tareaId: string;
  tipoProcesoId: string;
  descripcion: string | null;
  bienes: string[];
  unidadOrigenId: string | null;
  unidadDestinoId: string | null;
  ubicacionOrigenId: string | null;
  ubicacionDestinoId: string | null;
  responsableOrigenId: string | null;
  responsableDestinoId: string | null;
  motivo: string | null;
  observaciones: string | null;
}
