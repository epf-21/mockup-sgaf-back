import { Module } from '@nestjs/common';
import { UnidadRepositoryPort } from '../../dominio/unidades/puertos/unidad-repository.port';
import { ListarUnidadesUseCase } from '../../aplicacion/unidades/listar-unidades/listar-unidades.use-case';
import { PrismaUnidadRepository } from '../../infraestructura/unidades/prisma-unidad.repository';
import { UnidadesController } from './unidades.controller';

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
