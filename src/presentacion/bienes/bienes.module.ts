import { Module } from '@nestjs/common';
import { BienRepository } from '../../aplicacion/bienes/ports/bien.repository';
import { ReferenciasBienRepository } from '../../aplicacion/bienes/ports/referencias-bien.repository';
import { CrearBienInputBoundary } from '../../aplicacion/bienes/use-cases/crear-bien/crear-bien.input-boundary';
import { ListarBienesInputBoundary } from '../../aplicacion/bienes/use-cases/listar-bienes/listar-bienes.input-boundary';
import { ObtenerDetalleBienInputBoundary } from '../../aplicacion/bienes/use-cases/obtener-detalle-bien/obtener-detalle-bien.input-boundary';
import { CrearBienUseCase } from '../../aplicacion/bienes/use-cases/crear-bien/crear-bien.use-case';
import { ListarBienesUseCase } from '../../aplicacion/bienes/use-cases/listar-bienes/listar-bienes.use-case';
import { ObtenerDetalleBienUseCase } from '../../aplicacion/bienes/use-cases/obtener-detalle-bien/obtener-detalle-bien.use-case';
import { PrismaBienRepository } from '../../infraestructura/bienes/prisma-bien.repository';
import { PrismaReferenciasBienRepository } from '../../infraestructura/bienes/prisma-referencias-bien.repository';
import { BienesController } from './bienes.controller';

@Module({
  controllers: [BienesController],
  providers: [
    {
      provide: BienRepository,
      useClass: PrismaBienRepository,
    },
    {
      provide: ReferenciasBienRepository,
      useClass: PrismaReferenciasBienRepository,
    },
    {
      provide: CrearBienInputBoundary,
      useFactory: (
        bienes: BienRepository,
        referencias: ReferenciasBienRepository,
      ) => new CrearBienUseCase(bienes, referencias),
      inject: [BienRepository, ReferenciasBienRepository],
    },
    {
      provide: ListarBienesInputBoundary,
      useFactory: (repositorio: BienRepository) =>
        new ListarBienesUseCase(repositorio),
      inject: [BienRepository],
    },
    {
      provide: ObtenerDetalleBienInputBoundary,
      useFactory: (repositorio: BienRepository) =>
        new ObtenerDetalleBienUseCase(repositorio),
      inject: [BienRepository],
    },
  ],
})
export class BienesModule {}
