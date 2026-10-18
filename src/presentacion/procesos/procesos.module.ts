import { Module } from '@nestjs/common';
import { CrearProcesoInputBoundary } from '../../aplicacion/procesos/crear-proceso/crear-proceso.input-boundary';
import { CrearProcesoUseCase } from '../../aplicacion/procesos/crear-proceso/crear-proceso.use-case';
import { ListarProcesosInputBoundary } from '../../aplicacion/procesos/listar-procesos/listar-procesos.input-boundary';
import { ListarProcesosUseCase } from '../../aplicacion/procesos/listar-procesos/listar-procesos.use-case';
import { ObtenerProcesoInputBoundary } from '../../aplicacion/procesos/obtener-proceso/obtener-proceso.input-boundary';
import { ObtenerProcesoUseCase } from '../../aplicacion/procesos/obtener-proceso/obtener-proceso.use-case';
import { ProcesoGateway } from '../../dominio/procesos/gateways/proceso.gateway';
import { ReferenciasProcesoGateway } from '../../dominio/procesos/gateways/referencias-proceso.gateway';
import { PrismaProcesoGateway } from '../../infraestructura/procesos/prisma-proceso.gateway';
import { PrismaReferenciasProcesoGateway } from '../../infraestructura/procesos/prisma-referencias-proceso.gateway';
import { ProcesosController } from './procesos.controller';

@Module({
  controllers: [ProcesosController],
  providers: [
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
  ],
})
export class ProcesosModule {}
