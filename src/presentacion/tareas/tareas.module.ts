import { Module } from '@nestjs/common';
import { Reloj } from '../../aplicacion/comun/ports/reloj.port';
import { ReferenciasTareaRepository } from '../../aplicacion/tareas/ports/referencias-tarea.repository';
import { TareaRepository } from '../../aplicacion/tareas/ports/tarea.repository';
import { CerrarTareaInputBoundary } from '../../aplicacion/tareas/input-boundary/cerrar-tarea.input-boundary';
import { CerrarTareaUseCase } from '../../aplicacion/tareas/use-case/cerrar-tarea.use-case';
import { CrearTareaInputBoundary } from '../../aplicacion/tareas/input-boundary/crear-tarea.input-boundary';
import { ListarTareasInputBoundary } from '../../aplicacion/tareas/input-boundary/listar-tareas.input-boundary';
import { ObtenerTareaInputBoundary } from '../../aplicacion/tareas/input-boundary/obtener-tarea.input-boundary';
import { CrearTareaUseCase } from '../../aplicacion/tareas/use-case/crear-tarea.use-case';
import { ListarTareasUseCase } from '../../aplicacion/tareas/use-case/listar-tareas.use-case';
import { ObtenerTareaUseCase } from '../../aplicacion/tareas/use-case/obtener-tarea.use-case';
import { RelojSistema } from '../../infraestructura/comun/reloj-sistema';
import { PrismaReferenciasTareaRepository } from '../../infraestructura/tareas/prisma-referencias-tarea.repository';
import { PrismaTareaRepository } from '../../infraestructura/tareas/prisma-tarea.repository';
import { TareasController } from './tareas.controller';

@Module({
  controllers: [TareasController],
  providers: [
    {
      provide: Reloj,
      useClass: RelojSistema,
    },
    {
      provide: TareaRepository,
      useClass: PrismaTareaRepository,
    },
    {
      provide: ReferenciasTareaRepository,
      useClass: PrismaReferenciasTareaRepository,
    },
    {
      provide: CrearTareaInputBoundary,
      useFactory: (
        tareas: TareaRepository,
        referencias: ReferenciasTareaRepository,
      ) => new CrearTareaUseCase(tareas, referencias),
      inject: [TareaRepository, ReferenciasTareaRepository],
    },
    {
      provide: ListarTareasInputBoundary,
      useFactory: (tareas: TareaRepository) => new ListarTareasUseCase(tareas),
      inject: [TareaRepository],
    },
    {
      provide: ObtenerTareaInputBoundary,
      useFactory: (tareas: TareaRepository) => new ObtenerTareaUseCase(tareas),
      inject: [TareaRepository],
    },
    {
      provide: CerrarTareaInputBoundary,
      useFactory: (
        tareas: TareaRepository,
        referencias: ReferenciasTareaRepository,
        reloj: Reloj,
      ) => new CerrarTareaUseCase(tareas, referencias, reloj),
      inject: [TareaRepository, ReferenciasTareaRepository, Reloj],
    },
  ],
})
export class TareasModule {}
