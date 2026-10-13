import { Controller, Get, Inject } from '@nestjs/common';
import { ListarPersonasUseCase } from '../application/use-cases/listar-personas.use-case';
import { ListarUsuariosUseCase } from '../application/use-cases/listar-usuarios.use-case';

@Controller()
export class PersonasController {
  constructor(
    @Inject(ListarPersonasUseCase)
    private readonly listarPersonas: ListarPersonasUseCase,
    @Inject(ListarUsuariosUseCase)
    private readonly listarUsuarios: ListarUsuariosUseCase,
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
