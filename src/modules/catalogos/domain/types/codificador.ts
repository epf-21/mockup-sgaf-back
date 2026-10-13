export interface CodificadorResumen {
  id: string;
  codigo: string;
  nombre: string;
}

export interface CodificadorDetalle {
  id: string;
  codigo: string;
  nombre: string;
  clase: string;
  naturaleza: string;
  depreciable: boolean;
  tasa_depreciacion: string | null;
  vida_util_meses: number | null;
  metodo_depreciacion: string | null;
  cuenta_contable: string | null;
}
