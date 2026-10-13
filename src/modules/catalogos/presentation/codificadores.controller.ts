import { Controller, Get, Inject } from '@nestjs/common';
import { ListarCodificadoresResumenUseCase } from '../application/use-cases/listar-codificadores-resumen.use-case';
import { ListarCodificadoresDetalleUseCase } from '../application/use-cases/listar-codificadores-detalle.use-case';
import { AtributosPorCodificadorUseCase } from '../application/use-cases/atributos-por-codificador.use-case';

@Controller('codificadores')
export class CodificadoresController {
  constructor(
    @Inject(ListarCodificadoresResumenUseCase)
    private readonly listarResumen: ListarCodificadoresResumenUseCase,
    @Inject(ListarCodificadoresDetalleUseCase)
    private readonly listarDetalle: ListarCodificadoresDetalleUseCase,
    @Inject(AtributosPorCodificadorUseCase)
    private readonly atributosPorCodificador: AtributosPorCodificadorUseCase,
  ) {}

  @Get()
  getResumen() {
    return this.listarResumen.execute();
  }

  @Get('detalle')
  getDetalle() {
    return this.listarDetalle.execute();
  }

  @Get('atributos')
  getAtributos() {
    return this.atributosPorCodificador.execute();
  }
}
