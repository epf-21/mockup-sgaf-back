import { Controller, Get, Inject } from '@nestjs/common';
import { ListarUnidadesInputBoundary } from '../../aplicacion/unidades/input-boundary/listar-unidades.input-boundary';

@Controller('unidades')
export class UnidadesController {
  constructor(
    @Inject(ListarUnidadesInputBoundary)
    private readonly listarUnidades: ListarUnidadesInputBoundary,
  ) {}

  @Get()
  getUnidades() {
    return this.listarUnidades.execute();
  }
}
