import { Controller, Get, Inject } from '@nestjs/common';
import { ListarPersonasInputBoundary } from '../../aplicacion/personas/use-cases/listar-personas/listar-personas.input-boundary';
import { ListarUsuariosInputBoundary } from '../../aplicacion/personas/use-cases/listar-usuarios/listar-usuarios.input-boundary';

@Controller()
export class PersonasController {
  constructor(
    @Inject(ListarPersonasInputBoundary)
    private readonly listarPersonas: ListarPersonasInputBoundary,
    @Inject(ListarUsuariosInputBoundary)
    private readonly listarUsuarios: ListarUsuariosInputBoundary,
  ) {}

  @Get('personas')
  getPersonas() {
    return this.listarPersonas.execute();
  }

  @Get('usuarios')
  getUsuarios() {
    return this.listarUsuarios.execute();
  }
}
