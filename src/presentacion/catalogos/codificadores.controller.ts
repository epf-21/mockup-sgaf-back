import { Controller, Get, Inject } from '@nestjs/common';
import { ListarCodificadoresResumenUseCase } from '../../aplicacion/catalogos/listar-codificadores-resumen/listar-codificadores-resumen.use-case';
import { ListarCodificadoresDetalleUseCase } from '../../aplicacion/catalogos/listar-codificadores-detalle/listar-codificadores-detalle.use-case';

@Controller('codificadores')
export class CodificadoresController {
  constructor(
    @Inject(ListarCodificadoresResumenUseCase)
    private readonly listarResumen: ListarCodificadoresResumenUseCase,
    @Inject(ListarCodificadoresDetalleUseCase)
    private readonly listarDetalle: ListarCodificadoresDetalleUseCase,
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
