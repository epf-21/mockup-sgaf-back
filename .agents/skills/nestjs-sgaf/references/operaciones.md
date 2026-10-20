# Operaciones y entorno

Guía para compilar, ejecutar y verificar el backend sin romper datos ni configuración.

## Entorno local

Requisitos:

- Bun.
- PostgreSQL 15 (el repo incluye `compose.yml`).
- Variables en `.env`.

Variables relevantes:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/db_sgaf?schema=public"
PORT=3000
```

No leas, imprimas ni commitees el contenido real de `.env`. No inventes credenciales.

Base de datos:

```bash
docker compose up -d database
docker compose ps
```

El servicio se llama `database`, expone `5432` y usa la base `db_sgaf`.

## Comandos del proyecto

```bash
bun install
bun run build
bun run lint
bun run start
bun run start:dev
bun run start:prod
```

Notas:

- `bun run build` es la verificación principal de TypeScript.
- `bun run lint` ejecuta ESLint con `--fix`; puede modificar archivos. Revisa `git diff` después.
- `bun run start:dev` queda en watch y no termina; úsalo solo si necesitas el servidor.
- No uses `npm` ni `npx`; el proyecto usa `bun` y `bunx`.

## Prisma 7

El proyecto usa:

- `prisma/schema.prisma` con `generator client` y salida en `src/generated/prisma`.
- `prisma7.config.ts` para configuración de Prisma.
- `PrismaService` con `@prisma/adapter-pg`.
- Cliente generado importado desde `src/generated/prisma/client`.

Comandos seguros:

```bash
bunx prisma generate
bunx prisma validate
bunx prisma format
bunx prisma studio
```

Reglas:

- **No edites** `src/generated/prisma`; se regenera.
- **No crees ni apliques migraciones** sin autorización explícita.
- **No uses** `prisma migrate reset`, `db push --force-reset` ni borres tablas.
- `prisma migrate dev` puede ser interactivo y fallar en entornos no interactivos; si el usuario pide una migración, revisa primero el flujo y pide confirmación.
- Los seeds (`bun run db:seed`) actualizan datos demo y pueden sobrescribir cambios; no los ejecutes sin autorización.
- Si cambias `prisma/schema.prisma` sin migrar, el cliente y la base pueden quedar desalineados. No lo hagas silenciosamente.

Para patrones de consultas, transacciones y traducción de errores, consulta `references/prisma-integracion.md`.

Skills relacionadas:

- `prisma-cli`: comandos de Prisma 7.
- `prisma-client-api`: consultas, filtros y operaciones del cliente.
- `prisma-orm-setup`: conexión y configuración si hay que reparar el entorno.

## Pruebas

Política del proyecto para este agente:

- **No ejecutes tests** (`bun run test`, `bun run test:watch`, `bun run test:cov`, `bun run test:e2e`) salvo que el usuario lo pida explícitamente.
- La verificación estándar es `bun run build` + `bun run lint`.
- Si el usuario pide tests, primero revisa `test/` y la configuración de Jest; no inventes un framework nuevo.
- No agregues tests nuevos salvo que se pidan.

## Levantar el servidor para una prueba manual

Solo si el usuario lo pide o autoriza una verificación HTTP:

```bash
bun run start:dev > /tmp/sgaf-back.log 2>&1 &
echo $!
```

Detén el proceso al terminar:

```bash
kill <pid>
```

Si el puerto está ocupado, identifica el proceso antes de terminarlo:

```bash
ss -ltnp 'sport = :3000'
lsof -i :3000
```

No uses `kill -9` ni `fuser -k` sin verificar qué proceso es.

## Smoke test con curl

```bash
curl -s http://localhost:3000/bienes?pagina=1\&por_pagina=10
curl -s http://localhost:3000/procesos?pagina=1\&por_pagina=10
curl -s -X POST http://localhost:3000/tareas \
  -H 'Content-Type: application/json' \
  -d '{"categoria":"alta","usuario_id":"<uuid>"}'
```

Buenas prácticas:

- Usa IDs y datos de prueba claros.
- Limpia los registros creados al finalizar.
- No borres datos que no creaste.
- No ejecutes seeds para “restaurar” el entorno.
- Si una operación falla, revisa primero el estado real en la base con `bunx prisma studio` antes de modificar código.

## Logs y diagnóstico

- El servidor usa `Logger` de NestJS; los logs van a stdout.
- Si usas background, revisa `/tmp/sgaf-back.log`.
- Error de conexión a PostgreSQL: verifica `docker compose ps` y `DATABASE_URL`.
- Error de cliente Prisma desactualizado: `bunx prisma generate`.
- Error de validación 400: revisa el DTO y el body; `forbidNonWhitelisted` rechaza campos extra.
- Error 500 inesperado: revisa logs y la consulta Prisma; no expongas el detalle al cliente.

## Seguridad y datos

- No imprimas `.env` ni secretos en respuestas, logs o commits.
- No ejecutes operaciones destructivas sobre la base sin autorización.
- No hagas commit ni push salvo que se pida.
- No agregues dependencias nuevas sin verificar que el proyecto las necesita y que ya están en `package.json`.
- No desactives validaciones globales, filtros o reglas de negocio para “hacer pasar” una prueba.

## Checklist de operaciones

- [ ] `bun run build` pasa.
- [ ] `bun run lint` pasa.
- [ ] No se ejecutaron tests ni migraciones sin autorización.
- [ ] No se modificó `src/generated/prisma`.
- [ ] No se expusieron secretos.
- [ ] Si se levantó el servidor, se detuvo correctamente.
- [ ] Si se crearon datos de prueba, se limpiaron.
