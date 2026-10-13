import { Module } from '@nestjs/common';
import { UnidadRepositoryPort } from './domain/ports/unidad-repository.port';
import { ListarUnidadesUseCase } from './application/use-cases/listar-unidades.use-case';
import { PrismaUnidadRepository } from './infrastructure/prisma-unidad.repository';
import { UnidadesController } from './presentation/unidades.controller';

@Module({
  controllers: [UnidadesController],
  providers: [
    {
      provide: UnidadRepositoryPort,
      useClass: PrismaUnidadRepository,
    },
    {
      provide: ListarUnidadesUseCase,
      useFactory: (repositorio: UnidadRepositoryPort) =>
        new ListarUnidadesUseCase(repositorio),
      inject: [UnidadRepositoryPort],
    },
  ],
})
export class UnidadesModule {}
