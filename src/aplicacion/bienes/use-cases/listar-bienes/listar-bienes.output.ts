import type { PaginaOutput } from '../../../comun/paginacion/paginacion.output';

export interface BienResumenOutput {
  id: string;
  codigo: string;
  descripcion: string;
  codificador: string;
  unidad: string;
  responsable: string;
  estado: string;
  atributos: Record<string, string>;
}

export type ListarBienesOutput = PaginaOutput<BienResumenOutput>;
