import { Module } from '@nestjs/common';
import { CodificadorGateway } from '../../dominio/catalogos/gateways/codificador.gateway';
import { TipoProcesoCatalogoGateway } from '../../dominio/catalogos/gateways/tipo-proceso.gateway';
import { ListarCodificadoresResumenInputBoundary } from '../../aplicacion/catalogos/listar-codificadores-resumen/listar-codificadores-resumen.input-boundary';
import { ListarCodificadoresDetalleInputBoundary } from '../../aplicacion/catalogos/listar-codificadores-detalle/listar-codificadores-detalle.input-boundary';
import { ListarTiposProcesoInputBoundary } from '../../aplicacion/catalogos/listar-tipos-proceso/listar-tipos-proceso.input-boundary';
import { ObtenerTipoProcesoInputBoundary } from '../../aplicacion/catalogos/obtener-tipo-proceso/obtener-tipo-proceso.input-boundary';
import { ListarCodificadoresResumenUseCase } from '../../aplicacion/catalogos/listar-codificadores-resumen/listar-codificadores-resumen.use-case';
import { ListarCodificadoresDetalleUseCase } from '../../aplicacion/catalogos/listar-codificadores-detalle/listar-codificadores-detalle.use-case';
import { ListarTiposProcesoUseCase } from '../../aplicacion/catalogos/listar-tipos-proceso/listar-tipos-proceso.use-case';
import { ObtenerTipoProcesoUseCase } from '../../aplicacion/catalogos/obtener-tipo-proceso/obtener-tipo-proceso.use-case';
import { PrismaCodificadorGateway } from '../../infraestructura/catalogos/prisma-codificador.gateway';
import { PrismaTipoProcesoCatalogoGateway } from '../../infraestructura/catalogos/prisma-tipo-proceso.gateway';
import { CodificadoresController } from './codificadores.controller';
import { TiposProcesoController } from './tipos-proceso.controller';

@Module({
  controllers: [CodificadoresController, TiposProcesoController],
  providers: [
    {
      provide: CodificadorGateway,
      useClass: PrismaCodificadorGateway,
    },
    {
      provide: TipoProcesoCatalogoGateway,
      useClass: PrismaTipoProcesoCatalogoGateway,
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
    {
      provide: ListarTiposProcesoInputBoundary,
      useFactory: (tipos: TipoProcesoCatalogoGateway) =>
        new ListarTiposProcesoUseCase(tipos),
      inject: [TipoProcesoCatalogoGateway],
    },
    {
      provide: ObtenerTipoProcesoInputBoundary,
      useFactory: (tipos: TipoProcesoCatalogoGateway) =>
        new ObtenerTipoProcesoUseCase(tipos),
      inject: [TipoProcesoCatalogoGateway],
    },
  ],
})
export class CatalogosModule {}
