export enum OrigenTipo {
  Propio = 'propio',
  Alquiler = 'alquiler',
  Comodato = 'comodato',
  Convenio = 'convenio',
  PrestamoRecibido = 'prestamo_recibido',
}

export interface DatosCreacionBien {
  descripcion: string;
  responsableId: string;
  origenTipo: OrigenTipo;
  patrimonial: boolean;
}
