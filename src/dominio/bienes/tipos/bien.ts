export enum EstadoBien {
  EnRegistro = 'en_registro',
  Activo = 'activo',
  FueraDeServicio = 'fuera_de_servicio',
  EnPrestamo = 'en_prestamo',
  Baja = 'baja',
}

export enum EstadoFisico {
  Excelente = 'excelente',
  MuyBueno = 'muy_bueno',
  Bueno = 'bueno',
  Regular = 'regular',
  Malo = 'malo',
}

export enum OrigenTipo {
  Propio = 'propio',
  Alquiler = 'alquiler',
  Comodato = 'comodato',
  Convenio = 'convenio',
  PrestamoRecibido = 'prestamo_recibido',
}

export enum TipoDocumentoAdq {
  Factura = 'factura',
  ActaDonacion = 'acta_donacion',
  Contrato = 'contrato',
  Convenio = 'convenio',
  SinDocumento = 'sin_documento',
}

export type AtributosBien = Record<string, string | number | boolean>;

export type NuevoBien = {
  codificador_id: string;
  descripcion: string;
  unidad_id: string;
  responsable_id: string;
  patrimonial: boolean;
  valor_original: number | null;
  estado: EstadoBien;
  estado_fisico_inicial: EstadoFisico | null;
  estado_fisico: EstadoFisico | null;
  unidad_costo_id: string;
  fecha_alta: Date;
  adquisicion_tipo_documento: TipoDocumentoAdq;
  adquisicion_nro_documento: string | null;
  fecha_adquisicion: Date;
  origen_nombre: string | null;
  origen_tipo: OrigenTipo;
  ubicacion: string | null;
  atributos: AtributosBien;
};

export interface BienResumen {
  id: string;
  codigo: string;
  descripcion: string;
  codificador: string;
  unidad: string;
  responsable: string;
  estado: string;
  atributos: Record<string, string>;
}

export interface Paginacion {
  pagina: number;
  porPagina: number;
}

export interface PaginaBienResumen {
  datos: BienResumen[];
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
  siguiente: number | null;
  anterior: number | null;
}

export interface BienCreado {
  id: string;
  numero: number;
  descripcion: string;
  componentes: { id: string; numero: number; descripcion: string }[];
}

export interface ComponenteDetalle {
  id: string;
  codigo: string;
  descripcion: string;
  estado: string;
  atributos: Record<string, string>;
}

export interface MovimientoDetalle {
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

export interface BienDetalle {
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
  componentes: ComponenteDetalle[];
  movimientos: MovimientoDetalle[];
}
