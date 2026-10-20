export interface TareaUsuarioDetalleOutput {
  usuario_id: string;
  nombre_completo: string;
  email: string;
}

export interface ProcesoResumenOutput {
  id: string;
  codigo: string | null;
  estado: string;
  tipo: { codigo: string; nombre: string };
  fecha_autorizacion: Date | null;
  fecha_cierre: Date | null;
}

export interface ObtenerTareaOutput {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  estado: string;
  gestion: number;
  fecha_inicio: Date;
  fecha_finalizacion: Date | null;
  creado_por: TareaUsuarioDetalleOutput;
  supervisores: TareaUsuarioDetalleOutput[];
  inventariadores: TareaUsuarioDetalleOutput[];
  procesos: ProcesoResumenOutput[];
}
