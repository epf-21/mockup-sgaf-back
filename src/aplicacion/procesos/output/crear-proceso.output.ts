export interface CrearProcesoOutput {
  id: string;
  codigo: string;
  estado: string;
  descripcion: string | null;
  tipo_proceso: {
    id: string;
    codigo: string;
    nombre: string;
    categoria: string;
  };
  tarea: {
    id: string;
    codigo: string;
    categoria: string;
  };
  movimientos: number;
}
