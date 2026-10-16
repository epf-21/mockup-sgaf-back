export interface UsuarioResumen {
  id: string;
  nombre: string;
  rol: string;
}

export abstract class UsuarioGateway {
  abstract listarActivosGestion(): Promise<UsuarioResumen[]>;
}
