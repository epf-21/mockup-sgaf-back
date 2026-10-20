import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CompletarMovimientoInputBoundary } from '../../aplicacion/procesos/use-cases/completar-movimiento/completar-movimiento.input-boundary';
import { AccionProcesoBody } from './dto/accion-proceso.body';

@Controller('movimientos')
export class MovimientosController {
  constructor(
    @Inject(CompletarMovimientoInputBoundary)
    private readonly completarMovimiento: CompletarMovimientoInputBoundary,
  ) {}

  @Patch(':id/completar')
  completar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AccionProcesoBody,
  ) {
    return this.completarMovimiento.execute({
      movimientoId: id,
      usuarioId: body.usuario_id,
      observacion: body.observacion ?? null,
    });
  }
}
