import { Module } from '@nestjs/common';
import { UnidadRepository } from '../../aplicacion/unidades/ports/unidad.repository';
import { ListarUnidadesInputBoundary } from '../../aplicacion/unidades/use-cases/listar-unidades/listar-unidades.input-boundary';
import { ListarUnidadesUseCase } from '../../aplicacion/unidades/use-cases/listar-unidades/listar-unidades.use-case';
import { PrismaUnidadRepository } from '../../infraestructura/unidades/prisma-unidad.repository';
import { UnidadesController } from './unidades.controller';

@Module({
  controllers: [UnidadesController],
  providers: [
    {
      provide: UnidadRepository,
      useClass: PrismaUnidadRepository,
    },
    {
      provide: ListarUnidadesInputBoundary,
      useFactory: (repositorio: UnidadRepository) =>
        new ListarUnidadesUseCase(repositorio),
      inject: [UnidadRepository],
    },
  ],
})
export class UnidadesModule {}
