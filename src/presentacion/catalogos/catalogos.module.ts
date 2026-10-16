import { Module } from '@nestjs/common';
import { CodificadorGateway } from '../../dominio/catalogos/gateways/codificador.gateway';
import { ListarCodificadoresResumenInputBoundary } from '../../aplicacion/catalogos/listar-codificadores-resumen/listar-codificadores-resumen.input-boundary';
import { ListarCodificadoresDetalleInputBoundary } from '../../aplicacion/catalogos/listar-codificadores-detalle/listar-codificadores-detalle.input-boundary';
import { ListarCodificadoresResumenUseCase } from '../../aplicacion/catalogos/listar-codificadores-resumen/listar-codificadores-resumen.use-case';
import { ListarCodificadoresDetalleUseCase } from '../../aplicacion/catalogos/listar-codificadores-detalle/listar-codificadores-detalle.use-case';
import { PrismaCodificadorGateway } from '../../infraestructura/catalogos/prisma-codificador.gateway';
import { CodificadoresController } from './codificadores.controller';

@Module({
  controllers: [CodificadoresController],
  providers: [
    {
      provide: CodificadorGateway,
      useClass: PrismaCodificadorGateway,
    },
    {
      provide: ListarCodificadoresResumenInputBoundary,
      useFactory: (repositorio: CodificadorGateway) =>
        new ListarCodificadoresResumenUseCase(repositorio),
      inject: [CodificadorGateway],
    },
    {
      provide: ListarCodificadoresDetalleInputBoundary,
      useFactory: (repositorio: CodificadorGateway) =>
        new ListarCodificadoresDetalleUseCase(repositorio),
      inject: [CodificadorGateway],
    },
  ],
})
export class CatalogosModule {}
