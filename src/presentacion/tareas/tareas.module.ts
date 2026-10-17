import { Module } from '@nestjs/common';
import { ReferenciasTareaGateway } from '../../dominio/tareas/gateways/referencias-tarea.gateway';
import { TareaGateway } from '../../dominio/tareas/gateways/tarea.gateway';
import { CrearTareaInputBoundary } from '../../aplicacion/tareas/crear-tarea/crear-tarea.input-boundary';
import { ListarTareasInputBoundary } from '../../aplicacion/tareas/listar-tareas/listar-tareas.input-boundary';
import { ObtenerTareaInputBoundary } from '../../aplicacion/tareas/obtener-tarea/obtener-tarea.input-boundary';
import { CrearTareaUseCase } from '../../aplicacion/tareas/crear-tarea/crear-tarea.use-case';
import { ListarTareasUseCase } from '../../aplicacion/tareas/listar-tareas/listar-tareas.use-case';
import { ObtenerTareaUseCase } from '../../aplicacion/tareas/obtener-tarea/obtener-tarea.use-case';
import { PrismaReferenciasTareaGateway } from '../../infraestructura/tareas/prisma-referencias-tarea.gateway';
import { PrismaTareaGateway } from '../../infraestructura/tareas/prisma-tarea.gateway';
import { TareasController } from './tareas.controller';

@Module({
  controllers: [TareasController],
  providers: [
    {
      provide: TareaGateway,
      useClass: PrismaTareaGateway,
    },
    {
      provide: ReferenciasTareaGateway,
      useClass: PrismaReferenciasTareaGateway,
    },
    {
      provide: CrearTareaInputBoundary,
      useFactory: (
        tareas: TareaGateway,
        referencias: ReferenciasTareaGateway,
      ) => new CrearTareaUseCase(tareas, referencias),
      inject: [TareaGateway, ReferenciasTareaGateway],
    },
    {
      provide: ListarTareasInputBoundary,
      useFactory: (tareas: TareaGateway) => new ListarTareasUseCase(tareas),
      inject: [TareaGateway],
    },
    {
      provide: ObtenerTareaInputBoundary,
      useFactory: (tareas: TareaGateway) => new ObtenerTareaUseCase(tareas),
      inject: [TareaGateway],
    },
  ],
})
export class TareasModule {}
