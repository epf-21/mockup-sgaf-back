export interface ProcesoResumenOutput {
  id: string;
  codigo: string;
  tipo: {
    codigo: string;
    nombre: string;
  };
  unidad_origen: string | null;
  unidad_destino: string | null;
  bienes: number;
  estado: string;
}

export interface ListarProcesosOutput {
  datos: ProcesoResumenOutput[];
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
  siguiente: number | null;
  anterior: number | null;
}
