import { Module } from '@nestjs/common';
import { PersonaRepository } from '../../aplicacion/personas/ports/persona.repository';
import { UsuarioRepository } from '../../aplicacion/personas/ports/usuario.repository';
import { ListarPersonasInputBoundary } from '../../aplicacion/personas/use-cases/listar-personas/listar-personas.input-boundary';
import { ListarUsuariosInputBoundary } from '../../aplicacion/personas/use-cases/listar-usuarios/listar-usuarios.input-boundary';
import { ListarPersonasUseCase } from '../../aplicacion/personas/use-cases/listar-personas/listar-personas.use-case';
import { ListarUsuariosUseCase } from '../../aplicacion/personas/use-cases/listar-usuarios/listar-usuarios.use-case';
import { PrismaPersonaRepository } from '../../infraestructura/personas/prisma-persona.repository';
import { PrismaUsuarioRepository } from '../../infraestructura/personas/prisma-usuario.repository';
import { PersonasController } from './personas.controller';

@Module({
  controllers: [PersonasController],
  providers: [
    {
      provide: PersonaRepository,
      useClass: PrismaPersonaRepository,
    },
    {
      provide: UsuarioRepository,
      useClass: PrismaUsuarioRepository,
    },
    {
      provide: ListarPersonasInputBoundary,
      useFactory: (repositorio: PersonaRepository) =>
        new ListarPersonasUseCase(repositorio),
      inject: [PersonaRepository],
    },
    {
      provide: ListarUsuariosInputBoundary,
      useFactory: (repositorio: UsuarioRepository) =>
        new ListarUsuariosUseCase(repositorio),
      inject: [UsuarioRepository],
    },
  ],
})
export class PersonasModule {}
