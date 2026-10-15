import { Module } from '@nestjs/common';
import { BienRepositoryPort } from '../../dominio/bienes/puertos/bien-repository.port';
import { ReferenciasBienPort } from '../../dominio/bienes/puertos/referencias-bien.port';
import { CrearBienUseCase } from '../../aplicacion/bienes/crear-bien/crear-bien.use-case';
import { ListarBienesUseCase } from '../../aplicacion/bienes/listar-bienes/listar-bienes.use-case';
import { ObtenerDetalleBienUseCase } from '../../aplicacion/bienes/obtener-detalle-bien/obtener-detalle-bien.use-case';
import { PrismaBienRepository } from '../../infraestructura/bienes/prisma-bien.repository';
import { PrismaReferenciasBien } from '../../infraestructura/bienes/prisma-referencias-bien';
import { BienesController } from './bienes.controller';

@Module({
  controllers: [BienesController],
  providers: [
    {
      provide: BienRepositoryPort,
      useClass: PrismaBienRepository,
    },
    {
      provide: ReferenciasBienPort,
      useClass: PrismaReferenciasBien,
    },
    {
      provide: CrearBienUseCase,
      useFactory: (
        bienes: BienRepositoryPort,
        referencias: ReferenciasBienPort,
      ) => new CrearBienUseCase(bienes, referencias),
      inject: [BienRepositoryPort, ReferenciasBienPort],
    },
    {
      provide: ListarBienesUseCase,
      useFactory: (repositorio: BienRepositoryPort) =>
        new ListarBienesUseCase(repositorio),
      inject: [BienRepositoryPort],
    },
    {
      provide: ObtenerDetalleBienUseCase,
      useFactory: (repositorio: BienRepositoryPort) =>
        new ObtenerDetalleBienUseCase(repositorio),
      inject: [BienRepositoryPort],
    },
  ],
})
export class BienesModule {}
