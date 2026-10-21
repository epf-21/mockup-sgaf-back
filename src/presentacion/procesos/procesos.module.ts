import { Module } from '@nestjs/common';
import { CrearProcesoInputBoundary } from '../../aplicacion/procesos/input-boundary/crear-proceso.input-boundary';
import { CrearProcesoUseCase } from '../../aplicacion/procesos/use-case/crear-proceso.use-case';
import { CompletarMovimientoInputBoundary } from '../../aplicacion/procesos/input-boundary/completar-movimiento.input-boundary';
import { CompletarMovimientoUseCase } from '../../aplicacion/procesos/use-case/completar-movimiento.use-case';
import { ListarProcesosInputBoundary } from '../../aplicacion/procesos/input-boundary/listar-procesos.input-boundary';
import { ListarProcesosResumenInputBoundary } from '../../aplicacion/procesos/input-boundary/listar-procesos-resumen.input-boundary';
import { ListarProcesosUseCase } from '../../aplicacion/procesos/use-case/listar-procesos.use-case';
import { ListarProcesosResumenUseCase } from '../../aplicacion/procesos/use-case/listar-procesos-resumen.use-case';
import { ObtenerProcesoInputBoundary } from '../../aplicacion/procesos/input-boundary/obtener-proceso.input-boundary';
import { ObtenerProcesoUseCase } from '../../aplicacion/procesos/use-case/obtener-proceso.use-case';
import { TransicionarProcesoInputBoundary } from '../../aplicacion/procesos/input-boundary/transicionar-proceso.input-boundary';
import { TransicionarProcesoUseCase } from '../../aplicacion/procesos/use-case/transicionar-proceso.use-case';
import { Reloj } from '../../aplicacion/comun/ports/reloj.port';
import { ProcesoRepository } from '../../aplicacion/procesos/ports/proceso.repository';
import { ReferenciasProcesoRepository } from '../../aplicacion/procesos/ports/referencias-proceso.repository';
import { RelojSistema } from '../../infraestructura/comun/reloj-sistema';
import { PrismaProcesoRepository } from '../../infraestructura/procesos/prisma-proceso.repository';
import { PrismaReferenciasProcesoRepository } from '../../infraestructura/procesos/prisma-referencias-proceso.repository';
import { MovimientosController } from './movimientos.controller';
import { ProcesosController } from './procesos.controller';

@Module({
  controllers: [ProcesosController, MovimientosController],
  providers: [
    {
      provide: Reloj,
      useClass: RelojSistema,
    },
    {
      provide: ProcesoRepository,
      useClass: PrismaProcesoRepository,
    },
    {
      provide: ReferenciasProcesoRepository,
      useClass: PrismaReferenciasProcesoRepository,
    },
    {
      provide: CrearProcesoInputBoundary,
      useFactory: (
        procesos: ProcesoRepository,
        referencias: ReferenciasProcesoRepository,
      ) => new CrearProcesoUseCase(procesos, referencias),
      inject: [ProcesoRepository, ReferenciasProcesoRepository],
    },
    {
      provide: ListarProcesosInputBoundary,
      useFactory: (procesos: ProcesoRepository) =>
        new ListarProcesosUseCase(procesos),
      inject: [ProcesoRepository],
    },
    {
      provide: ListarProcesosResumenInputBoundary,
      useFactory: (procesos: ProcesoRepository) =>
        new ListarProcesosResumenUseCase(procesos),
      inject: [ProcesoRepository],
    },
    {
      provide: ObtenerProcesoInputBoundary,
      useFactory: (procesos: ProcesoRepository) =>
        new ObtenerProcesoUseCase(procesos),
      inject: [ProcesoRepository],
    },
    {
      provide: TransicionarProcesoInputBoundary,
      useFactory: (
        procesos: ProcesoRepository,
        referencias: ReferenciasProcesoRepository,
        reloj: Reloj,
      ) => new TransicionarProcesoUseCase(procesos, referencias, reloj),
      inject: [ProcesoRepository, ReferenciasProcesoRepository, Reloj],
    },
    {
      provide: CompletarMovimientoInputBoundary,
      useFactory: (
        procesos: ProcesoRepository,
        referencias: ReferenciasProcesoRepository,
      ) => new CompletarMovimientoUseCase(procesos, referencias),
      inject: [ProcesoRepository, ReferenciasProcesoRepository],
    },
  ],
})
export class ProcesosModule {}
