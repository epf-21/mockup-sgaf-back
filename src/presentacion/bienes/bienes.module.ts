import { Module } from '@nestjs/common';
import { BienGateway } from '../../dominio/bienes/gateways/bien.gateway';
import { ReferenciasBienGateway } from '../../dominio/bienes/gateways/referencias-bien.gateway';
import { CrearBienInputBoundary } from '../../aplicacion/bienes/crear-bien/crear-bien.input-boundary';
import { ListarBienesInputBoundary } from '../../aplicacion/bienes/listar-bienes/listar-bienes.input-boundary';
import { ObtenerDetalleBienInputBoundary } from '../../aplicacion/bienes/obtener-detalle-bien/obtener-detalle-bien.input-boundary';
import { CrearBienUseCase } from '../../aplicacion/bienes/crear-bien/crear-bien.use-case';
import { ListarBienesUseCase } from '../../aplicacion/bienes/listar-bienes/listar-bienes.use-case';
import { ObtenerDetalleBienUseCase } from '../../aplicacion/bienes/obtener-detalle-bien/obtener-detalle-bien.use-case';
import { PrismaBienGateway } from '../../infraestructura/bienes/prisma-bien.gateway';
import { PrismaReferenciasBienGateway } from '../../infraestructura/bienes/prisma-referencias-bien.gateway';
import { BienesController } from './bienes.controller';

@Module({
  controllers: [BienesController],
  providers: [
    {
      provide: BienGateway,
      useClass: PrismaBienGateway,
    },
    {
      provide: ReferenciasBienGateway,
      useClass: PrismaReferenciasBienGateway,
    },
    {
      provide: CrearBienInputBoundary,
      useFactory: (bienes: BienGateway, referencias: ReferenciasBienGateway) =>
        new CrearBienUseCase(bienes, referencias),
      inject: [BienGateway, ReferenciasBienGateway],
    },
    {
      provide: ListarBienesInputBoundary,
      useFactory: (repositorio: BienGateway) =>
        new ListarBienesUseCase(repositorio),
      inject: [BienGateway],
    },
    {
      provide: ObtenerDetalleBienInputBoundary,
      useFactory: (repositorio: BienGateway) =>
        new ObtenerDetalleBienUseCase(repositorio),
      inject: [BienGateway],
    },
  ],
})
export class BienesModule {}
