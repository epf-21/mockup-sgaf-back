import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infraestructura/base-datos/prisma.module';
import { CatalogosModule } from './presentacion/catalogos/catalogos.module';
import { UnidadesModule } from './presentacion/unidades/unidades.module';
import { PersonasModule } from './presentacion/personas/personas.module';
import { BienesModule } from './presentacion/bienes/bienes.module';
import { TareasModule } from './presentacion/tareas/tareas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CatalogosModule,
    UnidadesModule,
    PersonasModule,
    BienesModule,
    TareasModule,
  ],
  controllers: [],
})
export class AppModule {}
