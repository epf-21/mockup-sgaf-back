export interface UsuarioResumen {
  id: string;
  nombre: string;
  rol: string;
}

export abstract class UsuarioRepositoryPort {
  abstract listarActivosGestion(): Promise<UsuarioResumen[]>;
}
