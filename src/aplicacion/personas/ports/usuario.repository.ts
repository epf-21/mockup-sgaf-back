export interface UsuarioResumen {
  id: string;
  nombre: string;
  rol: string;
}

export abstract class UsuarioRepository {
  abstract listarActivosGestion(): Promise<UsuarioResumen[]>;
}
