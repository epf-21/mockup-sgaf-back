import { Module } from '@nestjs/common';
import { CodificadorRepositoryPort } from './domain/ports/codificador-repository.port';
import { ListarCodificadoresResumenUseCase } from './application/use-cases/listar-codificadores-resumen.use-case';
import { ListarCodificadoresDetalleUseCase } from './application/use-cases/listar-codificadores-detalle.use-case';
import { PrismaCodificadorRepository } from './infrastructure/prisma-codificador.repository';
import { CodificadoresController } from './presentation/codificadores.controller';

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
