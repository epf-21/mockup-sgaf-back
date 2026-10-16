import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CrearBienInputBoundary } from '../../aplicacion/bienes/crear-bien/crear-bien.input-boundary';
import { ListarBienesInputBoundary } from '../../aplicacion/bienes/listar-bienes/listar-bienes.input-boundary';
import { ObtenerDetalleBienInputBoundary } from '../../aplicacion/bienes/obtener-detalle-bien/obtener-detalle-bien.input-boundary';
import { CrearBienBody } from './dto/crear-bien.body';
import { ListarBienesQuery } from './dto/listar-bienes.query';
import { CrearBienMapper } from './mappers/crear-bien.mapper';
import { ListarBienesMapper } from './mappers/listar-bienes.mapper';

@Controller('bienes')
export class BienesController {
  constructor(
    @Inject(ListarBienesInputBoundary)
    private readonly listarBienes: ListarBienesInputBoundary,
    @Inject(CrearBienInputBoundary)
    private readonly crearBien: CrearBienInputBoundary,
    @Inject(ObtenerDetalleBienInputBoundary)
    private readonly obtenerDetalleBien: ObtenerDetalleBienInputBoundary,
  ) {}

  @Get()
  getBienes(@Query() query: ListarBienesQuery) {
    return this.listarBienes.execute(ListarBienesMapper.toPaginacion(query));
  }

  @Get(':id')
  getDetalle(@Param('id', ParseUUIDPipe) id: string) {
    return this.obtenerDetalleBien.execute(id);
  }

  @Post()
  async crear(@Body() body: CrearBienBody) {
    const input = CrearBienMapper.bodyToInput(body);
    return this.crearBien.execute(input);
  }
}
