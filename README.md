# mockup-sgaf-back

Backend desarrollado con [NestJS](https://nestjs.com/), [Prisma 7](https://www.prisma.io/) y PostgreSQL. La base de datos de desarrollo se ejecuta con Docker Compose.

## Requisitos

- Node.js 24 o compatible con el proyecto
- [Bun](https://bun.sh/)
- [Docker](https://docs.docker.com/get-docker/) con Docker Compose

## Configuración inicial

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone <URL_DEL_REPOSITORIO>
cd mockup-sgaf-back
```

Instala las dependencias:

```bash
bun install
```

Crea un archivo `.env` en la raíz con la conexión de PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/db_sgaf?schema=public"
```

La URL anterior coincide con las credenciales y el nombre de base de datos definidos en `compose.yml`.

## Ejecutar PostgreSQL con Docker Compose

Inicia el servicio de base de datos:

```bash
docker compose up -d database
```

## Configurar Prisma

Carga los datos demo de unidades organizacionales y usuarios:

```bash
bun run db:seed:unidades
bun run db:seed:usuarios
bun run db:seed:personas
```

Los usuarios creados pertenecen a los roles `inventariador`, `supervisor` y
`administrador`. Los seeds son repetibles y actualizan los registros demo si
ya existen.

Aplica las migraciones existentes en la base de datos:

```bash
bunx prisma migrate dev
```

Genera el cliente de Prisma:

```bash
bunx prisma generate
```

Valida y formatea el esquema cuando sea necesario:

```bash
bunx prisma validate
bunx prisma format
```

Durante el desarrollo, después de modificar `prisma/schema.prisma`, crea una nueva migración:

```bash
bunx prisma migrate dev --name nombre_de_la_migracion
bunx prisma generate
```

Para consultar la base de datos mediante la interfaz de Prisma:

```bash
bunx prisma studio
```

## Endpoints disponibles

Con NestJS ejecutándose en `http://localhost:3000`:

```text
GET /unidades
GET /usuarios
GET /personas
```

`GET /unidades` devuelve únicamente `id` y `nombre`. `GET /usuarios` devuelve
`id`, `nombre` y `rol` de los usuarios demo activos. `GET /personas` devuelve
`id` y `nombre` de todas las personas registradas.

## Ejecutar NestJS

Con PostgreSQL iniciado y Prisma configurado, ejecuta la aplicación en modo desarrollo:

```bash
bun run start:dev
```

La API queda disponible en `http://localhost:3000` o en el puerto definido por `PORT`.

Otros comandos útiles:

```bash
# Ejecución normal
bun run start

# Compilar el proyecto
bun run build

# Ejecutar la versión compilada
bun run start:prod
```

## Flujo completo desde cero

```bash
bun install
docker compose up -d database
bunx prisma migrate dev
bunx prisma generate
bun run start:dev
```

## Pruebas y calidad

```bash
# Pruebas unitarias
bun run test

# Pruebas end-to-end
bun run test:e2e

# Cobertura
bun run test:cov

# Linter y formato
bun run lint
bun run format
```

## Para ejecutar los seeders

```bash
bun run db:seed

```

## Estructura relevante

- `src/`: código de la aplicación NestJS.
- `src/database/`: módulo y servicio de Prisma.
- `prisma/schema.prisma`: modelo de datos.
- `prisma/migrations/`: migraciones de la base de datos.
- `compose.yml`: servicio PostgreSQL y volumen persistente.
- `prisma7.config.ts`: configuración de Prisma CLI.
