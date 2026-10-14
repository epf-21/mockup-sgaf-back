import { Module } from '@nestjs/common';
import { PersonaRepositoryPort } from '../../dominio/personas/puertos/persona-repository.port';
import { UsuarioRepositoryPort } from '../../dominio/personas/puertos/usuario-repository.port';
import { ListarPersonasUseCase } from '../../aplicacion/personas/listar-personas/listar-personas.use-case';
import { ListarUsuariosUseCase } from '../../aplicacion/personas/listar-usuarios/listar-usuarios.use-case';
import { PrismaPersonaRepository } from '../../infraestructura/personas/prisma-persona.repository';
import { PrismaUsuarioRepository } from '../../infraestructura/personas/prisma-usuario.repository';
import { PersonasController } from './personas.controller';

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
