import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { CatalogosModule } from './modules/catalogos/catalogos.module';
import { UnidadesModule } from './modules/unidades/unidades.module';
import { PersonasModule } from './modules/personas/personas.module';
import { BienesModule } from './modules/bienes/bienes.module';

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
  ],
  controllers: [AppController],
})
export class AppModule {}
