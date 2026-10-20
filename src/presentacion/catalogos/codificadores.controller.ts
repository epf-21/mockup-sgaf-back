import { Controller, Get, Inject } from '@nestjs/common';
import { ListarCodificadoresResumenInputBoundary } from '../../aplicacion/catalogos/use-cases/listar-codificadores-resumen/listar-codificadores-resumen.input-boundary';
import { ListarCodificadoresDetalleInputBoundary } from '../../aplicacion/catalogos/use-cases/listar-codificadores-detalle/listar-codificadores-detalle.input-boundary';

@Controller('codificadores')
export class CodificadoresController {
  constructor(
    @Inject(ListarCodificadoresResumenInputBoundary)
    private readonly listarResumen: ListarCodificadoresResumenInputBoundary,
    @Inject(ListarCodificadoresDetalleInputBoundary)
    private readonly listarDetalle: ListarCodificadoresDetalleInputBoundary,
  ) {}

  @Get()
  getResumen() {
    return this.listarResumen.execute();
  }

  @Get('detalle')
  getDetalle() {
    return this.listarDetalle.execute();
  }
}
