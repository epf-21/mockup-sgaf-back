import { Controller, Get, Inject } from '@nestjs/common';
import { ListarCodificadoresResumenInputBoundary } from '../../aplicacion/catalogos/listar-codificadores-resumen/listar-codificadores-resumen.input-boundary';
import { ListarCodificadoresDetalleInputBoundary } from '../../aplicacion/catalogos/listar-codificadores-detalle/listar-codificadores-detalle.input-boundary';

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
