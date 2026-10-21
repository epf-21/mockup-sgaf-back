export interface CodificadorDetalleOutput {
  id: string;
  codigo: string;
  nombre: string;
  clase: string;
  naturaleza: string;
  depreciable: boolean;
  tasa_depreciacion: string | null;
  vida_util_meses: number | null;
  cuenta_contable: string | null;
}

export type ListarCodificadoresDetalleOutput = CodificadorDetalleOutput[];
