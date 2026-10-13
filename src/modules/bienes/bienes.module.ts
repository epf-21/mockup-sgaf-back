import { Module } from '@nestjs/common';
import { CatalogosModule } from '../catalogos/catalogos.module';
import { CatalogoAtributosService } from '../catalogos/application/services/catalogo-atributos.service';
import { BienRepositoryPort } from './domain/ports/bien-repository.port';
import { ReferenciasBienPort } from './domain/ports/referencias-bien.port';
import { CrearBienUseCase } from './application/use-cases/crear-bien/crear-bien.use-case';
import { ListarBienesUseCase } from './application/use-cases/listar-bienes.use-case';
import { PrismaBienRepository } from './infrastructure/prisma-bien.repository';
import { PrismaReferenciasBien } from './infrastructure/prisma-referencias-bien';
import { BienesController } from './presentation/bienes.controller';

@Module({
  imports: [CatalogosModule],
  controllers: [BienesController],
  providers: [
    {
      provide: BienRepositoryPort,
      useClass: PrismaBienRepository,
    },
    {
      provide: ReferenciasBienPort,
      useClass: PrismaReferenciasBien,
    },
    {
      provide: CrearBienUseCase,
      useFactory: (
        bienes: BienRepositoryPort,
        referencias: ReferenciasBienPort,
        catalogoAtributos: CatalogoAtributosService,
      ) => new CrearBienUseCase(bienes, referencias, catalogoAtributos),
      inject: [
        BienRepositoryPort,
        ReferenciasBienPort,
        CatalogoAtributosService,
      ],
    },
    {
      provide: ListarBienesUseCase,
      useFactory: (repositorio: BienRepositoryPort) =>
        new ListarBienesUseCase(repositorio),
      inject: [BienRepositoryPort],
    },
  ],
})
export class BienesModule {}
