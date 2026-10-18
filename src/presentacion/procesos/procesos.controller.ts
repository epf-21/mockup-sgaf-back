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
import { CrearProcesoInputBoundary } from '../../aplicacion/procesos/crear-proceso/crear-proceso.input-boundary';
import { ListarProcesosInputBoundary } from '../../aplicacion/procesos/listar-procesos/listar-procesos.input-boundary';
import { ObtenerProcesoInputBoundary } from '../../aplicacion/procesos/obtener-proceso/obtener-proceso.input-boundary';
import { CrearProcesoBody } from './dto/crear-proceso.body';
import { ListarProcesosQuery } from './dto/listar-procesos.query';
import { CrearProcesoMapper } from './mappers/crear-proceso.mapper';
import { ListarProcesosMapper } from './mappers/listar-procesos.mapper';

@Controller('procesos')
export class ProcesosController {
  constructor(
    @Inject(ListarProcesosInputBoundary)
    private readonly listarProcesos: ListarProcesosInputBoundary,
    @Inject(CrearProcesoInputBoundary)
    private readonly crearProceso: CrearProcesoInputBoundary,
    @Inject(ObtenerProcesoInputBoundary)
    private readonly obtenerProceso: ObtenerProcesoInputBoundary,
  ) {}

  @Get()
  getProcesos(@Query() query: ListarProcesosQuery) {
    return this.listarProcesos.execute(
      ListarProcesosMapper.toPaginacion(query),
    );
  }

  @Get(':id')
  getDetalle(@Param('id', ParseUUIDPipe) id: string) {
    return this.obtenerProceso.execute(id);
  }

  @Post()
  crear(@Body() body: CrearProcesoBody) {
    return this.crearProceso.execute(CrearProcesoMapper.bodyToInput(body));
  }
}
