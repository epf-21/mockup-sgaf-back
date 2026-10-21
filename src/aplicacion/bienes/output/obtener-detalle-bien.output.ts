export interface ComponenteDetalleOutput {
  id: string;
  codigo: string;
  descripcion: string;
  estado: string;
  atributos: Record<string, string>;
}

export interface MovimientoDetalleOutput {
  id: string;
  motivo: string | null;
  observaciones: string | null;
  origen: {
    unidad: string | null;
    ubicacion: string | null;
    responsable: string | null;
  };
  destino: {
    unidad: string | null;
    ubicacion: string | null;
    responsable: string | null;
  };
  proceso: {
    id: string;
    codigo: string | null;
    estado: string;
    categoria: string;
    tipo: { codigo: string; nombre: string };
    fecha_autorizacion: Date | null;
    fecha_cierre: Date | null;
  };
}

export interface ObtenerDetalleBienOutput {
  id: string;
  codigo: string;
  descripcion: string;
  estado: string;
  estado_fisico: string | null;
  patrimonial: boolean;
  valor_original: number | null;
  fecha_alta: Date;
  fecha_adquisicion: Date;
  adquisicion: {
    tipo_documento: string;
    nro_documento: string | null;
  };
  origen: {
    nombre: string | null;
    tipo: string | null;
  };
  ubicacion: string | null;
  atributos: Record<string, string>;
  codificador: {
    id: string;
    codigo: string;
    nombre: string;
    clase: string;
  };
  unidad: {
    id: string;
    codigo: string;
    nombre: string;
  };
  unidad_costo: {
    id: string;
    codigo: string;
    nombre: string;
  };
  responsable: {
    id: string;
    documento_identidad: string;
    nombre_completo: string;
  };
  componentes: ComponenteDetalleOutput[];
  movimientos: MovimientoDetalleOutput[];
}
