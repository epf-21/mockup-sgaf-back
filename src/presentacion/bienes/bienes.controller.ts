import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { CrearBienUseCase } from '../../aplicacion/bienes/crear-bien/crear-bien.use-case';
import { ListarBienesUseCase } from '../../aplicacion/bienes/listar-bienes/listar-bienes.use-case';
import { CrearBienBody } from './dto/crear-bien.body';
import { ListarBienesQuery } from './dto/listar-bienes.query';
import { CrearBienMapper } from './mappers/crear-bien.mapper';
import { ListarBienesMapper } from './mappers/listar-bienes.mapper';

@Controller('bienes')
export class BienesController {
  constructor(
    @Inject(ListarBienesUseCase)
    private readonly listarBienes: ListarBienesUseCase,
    @Inject(CrearBienUseCase)
    private readonly crearBien: CrearBienUseCase,
  ) {}

  @Get()
  getBienes(@Query() query: ListarBienesQuery) {
    return this.listarBienes.execute(ListarBienesMapper.toPaginacion(query));
  }

  @Post()
  async crear(@Body() body: CrearBienBody) {
    const input = CrearBienMapper.bodyToInput(body);
    return this.crearBien.execute(input);
  }
}
