import { Module } from '@nestjs/common';
import { PersonaRepository } from '../../aplicacion/personas/ports/persona.repository';
import { UsuarioRepository } from '../../aplicacion/personas/ports/usuario.repository';
import { ListarPersonasInputBoundary } from '../../aplicacion/personas/input-boundary/listar-personas.input-boundary';
import { ListarUsuariosInputBoundary } from '../../aplicacion/personas/input-boundary/listar-usuarios.input-boundary';
import { ListarPersonasUseCase } from '../../aplicacion/personas/use-case/listar-personas.use-case';
import { ListarUsuariosUseCase } from '../../aplicacion/personas/use-case/listar-usuarios.use-case';
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
