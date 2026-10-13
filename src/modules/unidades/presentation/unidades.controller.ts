import { Controller, Get, Inject } from '@nestjs/common';
import { ListarUnidadesUseCase } from '../application/use-cases/listar-unidades.use-case';

@Controller('unidades')
export class UnidadesController {
  constructor(
    @Inject(ListarUnidadesUseCase)
    private readonly listarUnidades: ListarUnidadesUseCase,
  ) {}

  @Get()
  getUnidades() {
    return this.listarUnidades.execute();
  }
}
