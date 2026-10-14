import { Module } from '@nestjs/common';
import { CodificadorRepositoryPort } from '../../dominio/catalogos/puertos/codificador-repository.port';
import { ListarCodificadoresResumenUseCase } from '../../aplicacion/catalogos/listar-codificadores-resumen/listar-codificadores-resumen.use-case';
import { ListarCodificadoresDetalleUseCase } from '../../aplicacion/catalogos/listar-codificadores-detalle/listar-codificadores-detalle.use-case';
import { PrismaCodificadorRepository } from '../../infraestructura/catalogos/prisma-codificador.repository';
import { CodificadoresController } from './codificadores.controller';

@Module({
  controllers: [CodificadoresController],
  providers: [
    {
      provide: CodificadorRepositoryPort,
      useClass: PrismaCodificadorRepository,
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
  ],
})
export class CatalogosModule {}
