import { Module } from '@nestjs/common';
import { PersonaRepositoryPort } from './domain/ports/persona-repository.port';
import { UsuarioRepositoryPort } from './domain/ports/usuario-repository.port';
import { ListarPersonasUseCase } from './application/use-cases/listar-personas.use-case';
import { ListarUsuariosUseCase } from './application/use-cases/listar-usuarios.use-case';
import { PrismaPersonaRepository } from './infrastructure/prisma-persona.repository';
import { PrismaUsuarioRepository } from './infrastructure/prisma-usuario.repository';
import { PersonasController } from './presentation/personas.controller';

@Module({
  controllers: [PersonasController],
  providers: [
    {
      provide: PersonaRepositoryPort,
      useClass: PrismaPersonaRepository,
    },
    {
      provide: UsuarioRepositoryPort,
      useClass: PrismaUsuarioRepository,
    },
    {
      provide: ListarPersonasUseCase,
      useFactory: (repositorio: PersonaRepositoryPort) =>
        new ListarPersonasUseCase(repositorio),
      inject: [PersonaRepositoryPort],
    },
    {
      provide: ListarUsuariosUseCase,
      useFactory: (repositorio: UsuarioRepositoryPort) =>
        new ListarUsuariosUseCase(repositorio),
      inject: [UsuarioRepositoryPort],
    },
  ],
})
export class PersonasModule {}
