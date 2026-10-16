import { OrigenTipo } from '../tipos/bien';
import { DescripcionBienRequeridaError } from '../errores/descripcion-bien-requerida.error';
import { ResponsableBienRequeridoError } from '../errores/responsable-bien-requerido.error';

export interface DatosCreacionBien {
  descripcion: string;
  responsableId: string;
  origenTipo: OrigenTipo;
  patrimonial: boolean;
}

export class Bien {
  private constructor(
    readonly descripcion: string,
    readonly responsableId: string,
    readonly origenTipo: OrigenTipo,
    readonly patrimonial: boolean,
  ) {}

  static crear(datos: DatosCreacionBien): Bien {
    const descripcion = (datos.descripcion ?? '').trim();
    if (descripcion.length === 0) {
      throw new DescripcionBienRequeridaError();
    }
    if (!datos.responsableId) {
      throw new ResponsableBienRequeridoError();
    }

    return new Bien(
      descripcion,
      datos.responsableId,
      datos.origenTipo,
      Bien.calcularPatrimonial(datos.origenTipo, datos.patrimonial),
    );
  }

  static calcularPatrimonial(origen: OrigenTipo, solicitado: boolean): boolean {
    return origen === OrigenTipo.Propio ? solicitado : false;
  }

  static calcularCodigo(
    numero: number,
    esComponente: boolean,
    clase: string,
  ): string {
    const prefijo = esComponente || clase === 'material' ? 'NIM' : 'NIA';
    return `${prefijo}-${String(numero).padStart(5, '0')}`;
  }
}
