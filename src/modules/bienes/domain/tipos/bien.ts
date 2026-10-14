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
}

export interface BienCreado {
  id: string;
  numero: number;
  descripcion: string;
  componentes: { id: string; numero: number; descripcion: string }[];
}
