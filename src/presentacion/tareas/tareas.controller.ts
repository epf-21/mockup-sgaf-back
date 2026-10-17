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
import { CrearTareaInputBoundary } from '../../aplicacion/tareas/crear-tarea/crear-tarea.input-boundary';
import { ListarTareasInputBoundary } from '../../aplicacion/tareas/listar-tareas/listar-tareas.input-boundary';
import { ObtenerTareaInputBoundary } from '../../aplicacion/tareas/obtener-tarea/obtener-tarea.input-boundary';
import { CrearTareaBody } from './dto/crear-tarea.body';
import { ListarTareasQuery } from './dto/listar-tareas.query';
import { CrearTareaMapper } from './mappers/crear-tarea.mapper';
import { ListarTareasMapper } from './mappers/listar-tareas.mapper';

@Controller('tareas')
export class TareasController {
  constructor(
    @Inject(ListarTareasInputBoundary)
    private readonly listarTareas: ListarTareasInputBoundary,
    @Inject(CrearTareaInputBoundary)
    private readonly crearTarea: CrearTareaInputBoundary,
    @Inject(ObtenerTareaInputBoundary)
    private readonly obtenerTarea: ObtenerTareaInputBoundary,
  ) {}

  @Get()
  getTareas(@Query() query: ListarTareasQuery) {
    return this.listarTareas.execute(ListarTareasMapper.toPaginacion(query));
  }

  @Get(':id')
  getDetalle(@Param('id', ParseUUIDPipe) id: string) {
    return this.obtenerTarea.execute(id);
  }

  @Post()
  crear(@Body() body: CrearTareaBody) {
    return this.crearTarea.execute(CrearTareaMapper.bodyToInput(body));
  }
}
