import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CrearProcesoInputBoundary } from '../../aplicacion/procesos/input-boundary/crear-proceso.input-boundary';
import { ListarProcesosInputBoundary } from '../../aplicacion/procesos/input-boundary/listar-procesos.input-boundary';
import { ObtenerProcesoInputBoundary } from '../../aplicacion/procesos/input-boundary/obtener-proceso.input-boundary';
import { TransicionarProcesoInputBoundary } from '../../aplicacion/procesos/input-boundary/transicionar-proceso.input-boundary';
import { AccionProceso } from '../../aplicacion/procesos/tipos/proceso';
import { AccionProcesoBody } from './dto/accion-proceso.body';
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
    @Inject(TransicionarProcesoInputBoundary)
    private readonly transicionarProceso: TransicionarProcesoInputBoundary,
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

  @Patch(':id/autorizar')
  autorizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AccionProcesoBody,
  ) {
    return this.transicionarProceso.execute({
      procesoId: id,
      accion: AccionProceso.Autorizar,
      usuarioId: body.usuario_id,
      observacion: body.observacion ?? null,
    });
  }

  @Patch(':id/rechazar')
  rechazar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AccionProcesoBody,
  ) {
    return this.transicionarProceso.execute({
      procesoId: id,
      accion: AccionProceso.Rechazar,
      usuarioId: body.usuario_id,
      observacion: body.observacion ?? null,
    });
  }

  @Patch(':id/iniciar-ejecucion')
  iniciarEjecucion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AccionProcesoBody,
  ) {
    return this.transicionarProceso.execute({
      procesoId: id,
      accion: AccionProceso.IniciarEjecucion,
      usuarioId: body.usuario_id,
      observacion: body.observacion ?? null,
    });
  }

  @Patch(':id/cerrar')
  cerrar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AccionProcesoBody,
  ) {
    return this.transicionarProceso.execute({
      procesoId: id,
      accion: AccionProceso.Cerrar,
      usuarioId: body.usuario_id,
      observacion: body.observacion ?? null,
    });
  }
}
