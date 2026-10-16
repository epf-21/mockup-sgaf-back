import { Module } from '@nestjs/common';
import { PersonaGateway } from '../../dominio/personas/gateways/persona.gateway';
import { UsuarioGateway } from '../../dominio/personas/gateways/usuario.gateway';
import { ListarPersonasInputBoundary } from '../../aplicacion/personas/listar-personas/listar-personas.input-boundary';
import { ListarUsuariosInputBoundary } from '../../aplicacion/personas/listar-usuarios/listar-usuarios.input-boundary';
import { ListarPersonasUseCase } from '../../aplicacion/personas/listar-personas/listar-personas.use-case';
import { ListarUsuariosUseCase } from '../../aplicacion/personas/listar-usuarios/listar-usuarios.use-case';
import { PrismaPersonaGateway } from '../../infraestructura/personas/prisma-persona.gateway';
import { PrismaUsuarioGateway } from '../../infraestructura/personas/prisma-usuario.gateway';
import { PersonasController } from './personas.controller';

@Module({
  controllers: [PersonasController],
  providers: [
    {
      provide: PersonaGateway,
      useClass: PrismaPersonaGateway,
    },
    {
      provide: UsuarioGateway,
      useClass: PrismaUsuarioGateway,
    },
    {
      provide: ListarPersonasInputBoundary,
      useFactory: (repositorio: PersonaGateway) =>
        new ListarPersonasUseCase(repositorio),
      inject: [PersonaGateway],
    },
    {
      provide: ListarUsuariosInputBoundary,
      useFactory: (repositorio: UsuarioGateway) =>
        new ListarUsuariosUseCase(repositorio),
      inject: [UsuarioGateway],
    },
  ],
})
export class PersonasModule {}
