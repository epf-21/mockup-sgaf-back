export interface AtributoCatalogo {
  codigo: string;
  nombre: string;
  tipo_dato: string;
  obligatorio: boolean;
}

export interface CodificadorCatalogo {
  codigo: string;
  atributos: AtributoCatalogo[];
}
