import {
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ListarTiposProcesoInputBoundary } from '../../aplicacion/catalogos/use-cases/listar-tipos-proceso/listar-tipos-proceso.input-boundary';
import { ObtenerTipoProcesoInputBoundary } from '../../aplicacion/catalogos/use-cases/obtener-tipo-proceso/obtener-tipo-proceso.input-boundary';
import { ListarTiposProcesoQuery } from './dto/listar-tipos-proceso.query';

@Controller('tipos-proceso')
export class TiposProcesoController {
  constructor(
    @Inject(ListarTiposProcesoInputBoundary)
    private readonly listarTipos: ListarTiposProcesoInputBoundary,
    @Inject(ObtenerTipoProcesoInputBoundary)
    private readonly obtenerTipo: ObtenerTipoProcesoInputBoundary,
  ) {}

  @Get()
  getTipos(@Query() query: ListarTiposProcesoQuery) {
    return this.listarTipos.execute({
      categoria: query.categoria ?? null,
    });
  }

  @Get(':id')
  getTipo(@Param('id', ParseUUIDPipe) id: string) {
    return this.obtenerTipo.execute(id);
  }
}
