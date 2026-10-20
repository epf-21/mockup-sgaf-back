---
name: nestjs-sgaf
description: >-
  Use when working on the mockup-sgaf-back NestJS 11 backend: adding or
  refactoring modules, controllers, use cases, DTOs, providers, guards, pipes,
  interceptors, or exception filters; wiring dependency injection with
  useFactory; handling DomainError HTTP responses; or integrating Prisma 7 under
  Clean Architecture with Ports, Repositories, and InputBoundaries. Triggers on
  NestJS, Nest, controller, module, provider, useFactory, inject, DTO,
  class-validator, ValidationPipe, guard, interceptor, pipe, filter, Port,
  Repository, ports, repositories, InputBoundary, caso de uso, SGAF.
metadata:
  author: sgaf
  version: "2.0.0"
---

# NestJS SGAF

Guía operativa para construir y modificar el backend `mockup-sgaf-back` sin romper su Clean Architecture, sus convenciones de nombres ni su contrato HTTP.

## Cuándo usar esta skill

Úsala cuando la tarea implique:

- Crear o modificar un módulo, controller, provider, guard, interceptor, pipe o filter de NestJS.
- Agregar un caso de uso, un `InputBoundary` o una operación de aplicación.
- Agregar o cambiar un `Port` de aplicación, un `Output` de caso de uso y su adaptador Prisma.
- Crear DTOs, mappers, validaciones, paginación o manejo de errores HTTP.
- Cambiar el ensamble de dependencias en un módulo Nest.
- Integrar Prisma 7 desde infraestructura sin filtrarlo a dominio ni aplicación.

No la uses para cambios de esquema, migraciones o dudas aisladas del cliente Prisma: para eso existen las skills `prisma-cli` y `prisma-client-api` de este repositorio. Sí úsala para integrar esas consultas dentro de un repositorio y un caso de uso.

## Reglas no negociables

1. **Respeta la regla de dependencia:** `presentacion -> aplicacion -> dominio`; `infraestructura -> aplicacion -> dominio`. El dominio no conoce NestJS, Prisma, HTTP ni ports.
2. **Terminología obligatoria:** usa `Port` para los contratos de salida, `Repository` para los ports de persistencia, `InputBoundary` para los contratos de entrada y `Output` para las salidas de cada caso de uso. No uses la palabra “gateway”.
3. **Controllers delgados:** validan la entrada, mapean el DTO al input y delegan en un `InputBoundary`. No contienen reglas de negocio ni acceso a datos.
4. **Casos de uso puros:** son clases planas, sin decoradores de NestJS, que implementan un `InputBoundary` y reciben ports por constructor.
5. **Prisma solo en infraestructura:** los repositorios Prisma son los únicos que importan `PrismaService` o tipos de `src/generated/prisma`, e implementan ports de aplicación.
6. **El módulo Nest es el composition root:** declara controllers y providers; los casos de uso se construyen con `useFactory` + `inject`.
7. **Inyección explícita:** los controllers usan `@Inject(Token)` con la clase abstracta del boundary o port.
8. **Validación global ya existe:** `ValidationPipe` con `whitelist`, `forbidNonWhitelisted` y `transform` está en `src/main.ts`. No la dupliques por controller.
9. **Errores de dominio:** lanza `BusinessRuleError` o `NotFoundError`; `DomainExceptionFilter` los convierte en 400 o 404. No lances `HttpException` desde dominio/aplicación.
10. **No ejecutes tests** (`bun run test`, `test:e2e`, `test:cov`) salvo que el usuario lo pida explícitamente.
11. **No crees ni apliques migraciones Prisma** salvo que el usuario lo pida explícitamente. No uses `prisma migrate reset` ni borres datos.
12. **No hagas commit** salvo que el usuario lo pida.
13. **No agregues comentarios** al código salvo que el usuario los pida. El código debe explicarse por nombres y estructura.
14. **Usa `bun` y `bunx`,** no `npm` ni `npx`, para comandos del proyecto.

## Stack y comandos

- NestJS 11, TypeScript, Bun.
- Prisma 7 con `@prisma/adapter-pg` y PostgreSQL 15.
- Entrypoint: `src/main.ts`; módulo raíz: `src/app.module.ts`.
- `PrismaModule` es global; `ConfigModule` es global.
- Validación global: `ValidationPipe` en `src/main.ts`.
- Filtro global: `DomainExceptionFilter` en `src/infraestructura/comun/http-exception.filter.ts`.
- Prefijo de API: no hay; las rutas cuelgan de `/`.

```bash
bun install
bun run build
bun run lint
bun run start
bun run start:dev
```

`bun run lint` ejecuta ESLint con `--fix`; revisa el diff para no mezclar correcciones ajenas. Si solo quieres verificar sin modificar, usa `bunx eslint "src/**/*.ts"`.

## Mapa del repositorio

```text
src/
  dominio/                Reglas de negocio. Sin frameworks.
    <modulo>/
      entidades/          Entidades y reglas de negocio
      errores/            Errores de dominio del módulo
      tipos/              Tipos, enums e interfaces del dominio
    comun/errores/        Errores base compartidos
  aplicacion/             Casos de uso, boundaries, outputs y ports. Sin NestJS ni Prisma.
    <modulo>/
      use-cases/
        <accion>/
          <accion>.input.ts
          <accion>.input-boundary.ts
          <accion>.output.ts
          <accion>.use-case.ts
      ports/
        <modulo>.repository.ts
    comun/ports/reloj.port.ts
  infraestructura/        Adaptadores concretos.
    base-datos/           PrismaModule, PrismaService
    comun/                RelojSistema, DomainExceptionFilter
    <modulo>/             Prisma<Modulo>Repository
  presentacion/           Adaptadores HTTP y composition roots.
    <modulo>/
      dto/                *.body.ts, *.query.ts
      mappers/            DTO <-> input, query <-> paginación
      <modulo>.controller.ts
      <modulo>.module.ts
  generated/prisma/       Cliente generado. No editar.
```

## Flujo de trabajo

1. Lee `docs/ARCHITECTURE.md` y el módulo vecino más parecido antes de escribir.
2. Si hay persistencia, revisa `prisma/schema.prisma` y el port existente.
3. Implementa de adentro hacia afuera: dominio -> aplicación (port + caso de uso) -> infraestructura -> presentación -> módulo.
4. Si creas un módulo, regístralo en `src/app.module.ts`.
5. Ejecuta `bun run build` y `bun run lint`.
6. Verifica el endpoint solo si el usuario lo pide o si es seguro; no ejecutes tests por defecto.
7. Reporta archivos tocados, decisiones y comandos ejecutados.

## ¿Dónde va cada cosa?

| Necesidad | Capa | Archivo típico |
| --- | --- | --- |
| Regla o invariante de negocio | Dominio | `dominio/<modulo>/entidades/*.entity.ts` |
| Error de negocio | Dominio | `dominio/<modulo>/errores/*.error.ts` |
| Contrato de persistencia | Aplicación | `aplicacion/<modulo>/ports/*.repository.ts` |
| Salida de un caso de uso | Aplicación | `aplicacion/<modulo>/use-cases/<accion>/*.output.ts` |
| Otro contrato de salida | Aplicación | `aplicacion/<modulo>/ports/*.port.ts` |
| Operación de aplicación | Aplicación | `aplicacion/<modulo>/use-cases/<accion>/*.use-case.ts` |
| Contrato de entrada | Aplicación | `aplicacion/<modulo>/use-cases/<accion>/*.input-boundary.ts` |
| Consulta o escritura Prisma | Infraestructura | `infraestructura/<modulo>/prisma-*.repository.ts` |
| Validación HTTP | Presentación | `presentacion/<modulo>/dto/*.body.ts` / `*.query.ts` |
| Traducción DTO <-> input | Presentación | `presentacion/<modulo>/mappers/*.mapper.ts` |
| Ruta HTTP | Presentación | `presentacion/<modulo>/*.controller.ts` |
| Ensamble de dependencias | Presentación | `presentacion/<modulo>/*.module.ts` |
| Comportamiento transversal | Infraestructura/Presentación | `infraestructura/comun/*` |

## Planea antes de editar

- ¿La regla es de negocio? Debe vivir en dominio, no en el controller ni en el caso de uso.
- ¿La operación necesita datos externos? Define un `Port` en aplicación, declara las salidas en `.output.ts` e impleméntalo en infraestructura.
- ¿Es una nueva operación de aplicación? Crea input, boundary y use case; no agregues lógica al controller.
- ¿Es solo una consulta? Puede ser un caso de uso de lectura con su propio boundary.
- ¿Cambia el contrato HTTP? Actualiza DTO, mapper, controller y documentación si existe.
- ¿Necesitas un token nuevo? Usa la clase abstracta como token y regístralo en el módulo.

## Errores frecuentes

- Importar `PrismaService` o `@nestjs/common` dentro de `dominio/` o `aplicacion/`.
- Poner ports de persistencia en `dominio/` cuando solo los usan los casos de uso.
- Inyectar `CrearXUseCase` directamente en el controller en vez de `CrearXInputBoundary`.
- Olvidar `@Inject(Token)` y esperar que Nest resuelva la clase abstracta por tipo.
- Registrar el provider en el módulo pero olvidar el controller, o viceversa.
- Devolver modelos Prisma crudos en lugar de los tipos de salida (`*.output.ts`) o DTOs HTTP.
- Usar `any` para evitar tipar un port o un input.
- Duplicar `ValidationPipe` o `DomainExceptionFilter` en un módulo.
- Agregar lógica de negocio en un mapper o en un controller.
- Cambiar un DTO sin actualizar su mapper y el input del caso de uso.
- Ejecutar migraciones o seeds sin autorización.

## Referencias

Lee solo la referencia que necesites para la tarea; no cargues las seis si el cambio es acotado.

- `references/arquitectura.md`: capas, estructura, reglas y ejemplos de dominio.
- `references/modulo-di.md`: módulos Nest, tokens, `useFactory`, `inject` y errores de DI.
- `references/http-dto-errores.md`: controllers, DTOs, validación, paginación, mappers y errores.
- `references/recetas.md`: recetas paso a paso para agregar funcionalidad.
- `references/prisma-integracion.md`: consultas, transacciones, errores y tipos con Prisma 7.
- `references/operaciones.md`: entorno, comandos, Prisma, pruebas manuales y seguridad.

## Checklist de cierre

- [ ] La lógica de negocio quedó en dominio.
- [ ] El caso de uso no importa NestJS ni Prisma.
- [ ] El controller solo valida, mapea y delega.
- [ ] El port está declarado en `aplicacion/<modulo>/ports/` como clase abstracta.
- [ ] Las salidas del caso de uso están en `aplicacion/<modulo>/use-cases/<accion>/*.output.ts`.
- [ ] El adaptador Prisma implementa el port desde infraestructura.
- [ ] El provider usa `useFactory` + `inject` cuando corresponde.
- [ ] El módulo registra controllers y providers.
- [ ] El módulo nuevo está en `AppModule`.
- [ ] `bun run build` pasa.
- [ ] `bun run lint` pasa sin errores.
- [ ] `dominio/` no importa `aplicacion/` ni `infraestructura/`.
- [ ] No se ejecutaron tests ni migraciones sin autorización.
