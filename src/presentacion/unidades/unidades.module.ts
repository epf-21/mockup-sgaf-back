import { Module } from '@nestjs/common';
import { UnidadGateway } from '../../dominio/unidades/gateways/unidad.gateway';
import { ListarUnidadesInputBoundary } from '../../aplicacion/unidades/listar-unidades/listar-unidades.input-boundary';
import { ListarUnidadesUseCase } from '../../aplicacion/unidades/listar-unidades/listar-unidades.use-case';
import { PrismaUnidadGateway } from '../../infraestructura/unidades/prisma-unidad.gateway';
import { UnidadesController } from './unidades.controller';

@Module({
  controllers: [UnidadesController],
  providers: [
    {
      provide: UnidadGateway,
      useClass: PrismaUnidadGateway,
    },
    {
      provide: ListarUnidadesInputBoundary,
      useFactory: (repositorio: UnidadGateway) =>
        new ListarUnidadesUseCase(repositorio),
      inject: [UnidadGateway],
    },
  ],
})
export class UnidadesModule {}
