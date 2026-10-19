import { Module } from '@nestjs/common';
import { CrearProcesoInputBoundary } from '../../aplicacion/procesos/crear-proceso/crear-proceso.input-boundary';
import { CrearProcesoUseCase } from '../../aplicacion/procesos/crear-proceso/crear-proceso.use-case';
import { CompletarMovimientoInputBoundary } from '../../aplicacion/procesos/completar-movimiento/completar-movimiento.input-boundary';
import { CompletarMovimientoUseCase } from '../../aplicacion/procesos/completar-movimiento/completar-movimiento.use-case';
import { ListarProcesosInputBoundary } from '../../aplicacion/procesos/listar-procesos/listar-procesos.input-boundary';
import { ListarProcesosUseCase } from '../../aplicacion/procesos/listar-procesos/listar-procesos.use-case';
import { ObtenerProcesoInputBoundary } from '../../aplicacion/procesos/obtener-proceso/obtener-proceso.input-boundary';
import { ObtenerProcesoUseCase } from '../../aplicacion/procesos/obtener-proceso/obtener-proceso.use-case';
import { TransicionarProcesoInputBoundary } from '../../aplicacion/procesos/transicionar-proceso/transicionar-proceso.input-boundary';
import { TransicionarProcesoUseCase } from '../../aplicacion/procesos/transicionar-proceso/transicionar-proceso.use-case';
import { Reloj } from '../../dominio/comun/reloj';
import { ProcesoGateway } from '../../dominio/procesos/gateways/proceso.gateway';
import { ReferenciasProcesoGateway } from '../../dominio/procesos/gateways/referencias-proceso.gateway';
import { RelojSistema } from '../../infraestructura/comun/reloj-sistema';
import { PrismaProcesoGateway } from '../../infraestructura/procesos/prisma-proceso.gateway';
import { PrismaReferenciasProcesoGateway } from '../../infraestructura/procesos/prisma-referencias-proceso.gateway';
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
      provide: ProcesoGateway,
      useClass: PrismaProcesoGateway,
    },
    {
      provide: ReferenciasProcesoGateway,
      useClass: PrismaReferenciasProcesoGateway,
    },
    {
      provide: CrearProcesoInputBoundary,
      useFactory: (
        procesos: ProcesoGateway,
        referencias: ReferenciasProcesoGateway,
      ) => new CrearProcesoUseCase(procesos, referencias),
      inject: [ProcesoGateway, ReferenciasProcesoGateway],
    },
    {
      provide: ListarProcesosInputBoundary,
      useFactory: (procesos: ProcesoGateway) =>
        new ListarProcesosUseCase(procesos),
      inject: [ProcesoGateway],
    },
    {
      provide: ObtenerProcesoInputBoundary,
      useFactory: (procesos: ProcesoGateway) =>
        new ObtenerProcesoUseCase(procesos),
      inject: [ProcesoGateway],
    },
    {
      provide: TransicionarProcesoInputBoundary,
      useFactory: (
        procesos: ProcesoGateway,
        referencias: ReferenciasProcesoGateway,
        reloj: Reloj,
      ) => new TransicionarProcesoUseCase(procesos, referencias, reloj),
      inject: [ProcesoGateway, ReferenciasProcesoGateway, Reloj],
    },
    {
      provide: CompletarMovimientoInputBoundary,
      useFactory: (
        procesos: ProcesoGateway,
        referencias: ReferenciasProcesoGateway,
      ) => new CompletarMovimientoUseCase(procesos, referencias),
      inject: [ProcesoGateway, ReferenciasProcesoGateway],
    },
  ],
})
export class ProcesosModule {}
