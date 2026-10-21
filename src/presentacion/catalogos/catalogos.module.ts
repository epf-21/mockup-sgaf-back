import { Module } from '@nestjs/common';
import { CodificadorRepository } from '../../aplicacion/catalogos/ports/codificador.repository';
import { TipoProcesoCatalogoRepository } from '../../aplicacion/catalogos/ports/tipo-proceso.repository';
import { ListarCodificadoresResumenInputBoundary } from '../../aplicacion/catalogos/input-boundary/listar-codificadores-resumen.input-boundary';
import { ListarCodificadoresDetalleInputBoundary } from '../../aplicacion/catalogos/input-boundary/listar-codificadores-detalle.input-boundary';
import { ListarTiposProcesoInputBoundary } from '../../aplicacion/catalogos/input-boundary/listar-tipos-proceso.input-boundary';
import { ObtenerTipoProcesoInputBoundary } from '../../aplicacion/catalogos/input-boundary/obtener-tipo-proceso.input-boundary';
import { ListarCodificadoresResumenUseCase } from '../../aplicacion/catalogos/use-case/listar-codificadores-resumen.use-case';
import { ListarCodificadoresDetalleUseCase } from '../../aplicacion/catalogos/use-case/listar-codificadores-detalle.use-case';
import { ListarTiposProcesoUseCase } from '../../aplicacion/catalogos/use-case/listar-tipos-proceso.use-case';
import { ObtenerTipoProcesoUseCase } from '../../aplicacion/catalogos/use-case/obtener-tipo-proceso.use-case';
import { PrismaCodificadorRepository } from '../../infraestructura/catalogos/prisma-codificador.repository';
import { PrismaTipoProcesoCatalogoRepository } from '../../infraestructura/catalogos/prisma-tipo-proceso.repository';
import { CodificadoresController } from './codificadores.controller';
import { TiposProcesoController } from './tipos-proceso.controller';

@Module({
  controllers: [CodificadoresController, TiposProcesoController],
  providers: [
    {
      provide: CodificadorRepository,
      useClass: PrismaCodificadorRepository,
    },
    {
      provide: TipoProcesoCatalogoRepository,
      useClass: PrismaTipoProcesoCatalogoRepository,
    },
    {
      provide: ListarCodificadoresResumenInputBoundary,
      useFactory: (repositorio: CodificadorRepository) =>
        new ListarCodificadoresResumenUseCase(repositorio),
      inject: [CodificadorRepository],
    },
    {
      provide: ListarCodificadoresDetalleInputBoundary,
      useFactory: (repositorio: CodificadorRepository) =>
        new ListarCodificadoresDetalleUseCase(repositorio),
      inject: [CodificadorRepository],
    },
    {
      provide: ListarTiposProcesoInputBoundary,
      useFactory: (tipos: TipoProcesoCatalogoRepository) =>
        new ListarTiposProcesoUseCase(tipos),
      inject: [TipoProcesoCatalogoRepository],
    },
    {
      provide: ObtenerTipoProcesoInputBoundary,
      useFactory: (tipos: TipoProcesoCatalogoRepository) =>
        new ObtenerTipoProcesoUseCase(tipos),
      inject: [TipoProcesoCatalogoRepository],
    },
  ],
})
export class CatalogosModule {}
