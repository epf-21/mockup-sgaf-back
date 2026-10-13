import { Module } from '@nestjs/common';
import { CodificadorRepositoryPort } from './domain/ports/codificador-repository.port';
import { CatalogoAtributosPort } from './domain/ports/catalogo-atributos.port';
import { CatalogoAtributosService } from './application/services/catalogo-atributos.service';
import { ListarCodificadoresResumenUseCase } from './application/use-cases/listar-codificadores-resumen.use-case';
import { ListarCodificadoresDetalleUseCase } from './application/use-cases/listar-codificadores-detalle.use-case';
import { AtributosPorCodificadorUseCase } from './application/use-cases/atributos-por-codificador.use-case';
import { PrismaCodificadorRepository } from './infrastructure/prisma-codificador.repository';
import { ArchivoAtributosCatalogo } from './infrastructure/archivo-atributos.catalogo';
import { CodificadoresController } from './presentation/codificadores.controller';

@Module({
  controllers: [CodificadoresController],
  providers: [
    {
      provide: CodificadorRepositoryPort,
      useClass: PrismaCodificadorRepository,
    },
    {
      provide: CatalogoAtributosPort,
      useClass: ArchivoAtributosCatalogo,
    },
    {
      provide: CatalogoAtributosService,
      useFactory: (catalogo: CatalogoAtributosPort) =>
        new CatalogoAtributosService(catalogo),
      inject: [CatalogoAtributosPort],
    },
    {
      provide: ListarCodificadoresResumenUseCase,
      useFactory: (repositorio: CodificadorRepositoryPort) =>
        new ListarCodificadoresResumenUseCase(repositorio),
      inject: [CodificadorRepositoryPort],
    },
    {
      provide: ListarCodificadoresDetalleUseCase,
      useFactory: (repositorio: CodificadorRepositoryPort) =>
        new ListarCodificadoresDetalleUseCase(repositorio),
      inject: [CodificadorRepositoryPort],
    },
    {
      provide: AtributosPorCodificadorUseCase,
      useFactory: (
        repositorio: CodificadorRepositoryPort,
        catalogoAtributos: CatalogoAtributosService,
      ) => new AtributosPorCodificadorUseCase(repositorio, catalogoAtributos),
      inject: [CodificadorRepositoryPort, CatalogoAtributosService],
    },
  ],
  exports: [CatalogoAtributosService],
})
export class CatalogosModule {}
