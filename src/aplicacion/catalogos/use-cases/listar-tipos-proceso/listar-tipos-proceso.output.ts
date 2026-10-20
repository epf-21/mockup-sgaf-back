export interface TipoProcesoCatalogoOutput {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  requiere_autorizacion: boolean;
  requiere_ejecucion_campo: boolean;
  requiere_aceptacion_custodia: boolean;
  genera_formulario: boolean;
  genera_movimiento: boolean;
  afecta_patrimonio: boolean;
  afecta_depreciacion: boolean;
}

export type ListarTiposProcesoOutput = TipoProcesoCatalogoOutput[];
