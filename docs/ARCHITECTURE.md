# Arquitectura

Backend del **Sistema de Gestión de Activos Fijos (SGAF)**: una API REST
desarrollada con **NestJS**, **Prisma 7** y **PostgreSQL**.

El proyecto sigue **Clean Architecture** (arquitectura limpia): el código se organiza
en capas concéntricas donde las reglas de negocio y los contratos viven en el centro,
y los detalles tecnológicos (NestJS, Prisma, HTTP) quedan en la periferia.

## ¿Por qué Clean Architecture?

- **Independencia de frameworks.** El núcleo del negocio no conoce NestJS ni HTTP;
  los casos de uso se podrían ejecutar desde un CLI o un test sin levantar la API.
- **Independencia de la base de datos.** El dominio no conoce Prisma ni PostgreSQL;
  solo define los **puertos** (interfaces) que la infraestructura implementa.
- **Testabilidad.** Los casos de uso se prueban inyectando dobles de prueba sobre
  los puertos, sin base de datos real.
- **Regla de dependencia.** Las dependencias siempre apuntan **hacia el dominio**.
  Nunca al revés: el dominio no importa nada de las capas externas.

## Las cuatro capas

| Capa | Responsabilidad | Depende de |
| --- | --- | --- |
| `dominio/` | Entidades, tipos, reglas y **puertos** (contratos). | Nadie |
| `aplicacion/` | **Casos de uso**: orquestan el dominio usando puertos. | dominio |
| `presentacion/` | Controllers, DTOs, mappers y módulos Nest (DI). | aplicacion |
| `infraestructura/` | Implementaciones concretas: Prisma y adaptadores. | dominio |

```mermaid
flowchart TB
    subgraph presentacion["presentacion/ · Controllers, DTOs, Mappers, Modules"]
        C[Controller] --> M[Mapper]
    end

    subgraph aplicacion["aplicacion/ · Casos de uso"]
        UC[UseCase]
    end

    subgraph dominio["dominio/ · Tipos, Errores, Puertos"]
        P[[Puerto]]
        T[Tipos / Entidades]
        E[Errores de negocio]
    end

    subgraph infraestructura["infraestructura/ · Prisma, Adaptadores"]
        R[Repositorio Prisma]
    end

    M --> UC
    UC --> P
    UC --> T
    UC --> E
    R -. implementa .-> P
    R --> DB[(PostgreSQL)]

    presentacion -. usa .-> aplicacion
    aplicacion -. usa .-> dominio
    infraestructura -. implementa .-> dominio
```

La flecha punteada `Repositorio -. implementa .-> Puerto` es la **inversión de
dependencias**: el dominio define el contrato y la infraestructura lo cumple, de modo
que el caso de uso nunca importa Prisma.

## Estructura de carpetas

La estructura va **primero por capa y luego por módulo**:

```text
src/
  dominio/                      # Reglas y contratos (sin NestJS, sin Prisma)
    bienes/
      tipos/bien.ts             # Tipos y enums del módulo
      puertos/bien-repository.port.ts
      errores/bien-no-encontrado.error.ts
    catalogos/
    personas/
    unidades/
    comun/errores/              # Errores base reutilizables (DomainError, etc.)

  aplicacion/                   # Casos de uso (uno por carpeta)
    bienes/
      listar-bienes/listar-bienes.use-case.ts
      crear-bien/crear-bien.use-case.ts
      crear-bien/crear-bien.input.ts
      obtener-detalle-bien/obtener-detalle-bien.use-case.ts
    catalogos/
    personas/
    unidades/

  presentacion/                 # Adaptadores de entrada (HTTP)
    bienes/
      bienes.controller.ts
      bienes.module.ts
      dto/crear-bien.body.ts
      dto/listar-bienes.query.ts
      mappers/crear-bien.mapper.ts
    catalogos/
    personas/
    unidades/

  infraestructura/              # Adaptadores de salida (detalles técnicos)
    base-datos/
      prisma.module.ts
      prisma.service.ts
    bienes/
      prisma-bien.repository.ts
      prisma-referencias-bien.ts
    catalogos/
    personas/
    unidades/
    comun/
      http-exception.filter.ts

  app.module.ts                 # Módulo raíz: importa los módulos de presentación
  main.ts                       # Bootstrap de NestJS (pipes y filtros globales)
```


## Cómo se construye un módulo

Cada módulo de negocio (`bienes`, `catalogos`, `personas`, `unidades`, …) se reparte
por las cuatro capas. Usamos **`bienes`** como ejemplo; todos los módulos siguen el
mismo patrón.

### 1. Dominio — tipos y reglas

Los tipos representan el lenguaje del negocio. No tienen decoradores ni dependencias
externas.

```ts
// src/dominio/bienes/tipos/bien.ts
export enum EstadoBien {
  EnRegistro = 'en_registro',
  Activo = 'activo',
  Baja = 'baja',
}

export interface Paginacion {
  pagina: number;
  porPagina: number;
}
```

### 2. Dominio — puerto (contrato)

El puerto es una **clase abstracta** que actúa como token de inyección y define los
métodos que la infraestructura debe implementar. El caso de uso depende de esta
abstracción, no de Prisma.

```ts
// src/dominio/bienes/puertos/bien-repository.port.ts
export abstract class BienRepositoryPort {
  abstract listarPaginado(paginacion: Paginacion): Promise<PaginaBienResumen>;
  abstract obtenerDetalle(id: string): Promise<BienDetalle | null>;
  abstract crearConComponentes(
    padre: NuevoBien,
    componentes: NuevoBien[],
  ): Promise<BienCreado>;
}
```

### 3. Aplicación — caso de uso

El caso de uso contiene la lógica de orquestación. Recibe sus dependencias (puertos)
por constructor y **no conoce NestJS, HTTP ni Prisma**.

```ts
// src/aplicacion/bienes/listar-bienes/listar-bienes.use-case.ts
export class ListarBienesUseCase {
  constructor(private readonly repositorio: BienRepositoryPort) {}

  execute(paginacion: Paginacion) {
    return this.repositorio.listarPaginado(paginacion);
  }
}
```

Cuando un caso de uso necesita validar reglas de negocio, lanza errores del dominio
(por ejemplo `NotFoundError` o `BienNoEncontradoError`), que presentación traduce a
respuestas HTTP.

### 4. Presentación — DTO, mapper y controller

- **DTO**: valida y tipa la entrada HTTP con `class-validator`/`class-transformer`.
- **Mapper**: traduce entre el mundo HTTP y los tipos de la aplicación.
- **Controller**: sólo conecta la petición con el caso de uso.

```ts
// src/presentacion/bienes/dto/listar-bienes.query.ts
export class ListarBienesQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  pagina?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(1000)
  por_pagina?: number;
}
```

```ts
// src/presentacion/bienes/bienes.controller.ts
@Controller('bienes')
export class BienesController {
  constructor(
    @Inject(ListarBienesUseCase)
    private readonly listarBienes: ListarBienesUseCase,
    @Inject(ObtenerDetalleBienUseCase)
    private readonly obtenerDetalleBien: ObtenerDetalleBienUseCase,
  ) {}

  @Get()
  getBienes(@Query() query: ListarBienesQuery) {
    return this.listarBienes.execute(ListarBienesMapper.toPaginacion(query));
  }

  @Get(':id')
  getDetalle(@Param('id', ParseUUIDPipe) id: string) {
    return this.obtenerDetalleBien.execute(id);
  }
}
```

### 5. Infraestructura — repositorio Prisma

Implementa el puerto del dominio. Es el **único lugar** que conoce Prisma. Puede tener
nombres y detalles propios de la base de datos.

```ts
// src/infraestructura/bienes/prisma-bien.repository.ts
@Injectable()
export class PrismaBienRepository implements BienRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async listarPaginado(paginacion: Paginacion): Promise<PaginaBienResumen> {
    // consultas a Prisma...
  }
}
```

### 6. Presentación — módulo Nest (ensamble de dependencias)

El módulo no contiene lógica: sólo **cablea** puertos con implementaciones y crea los
casos de uso con `useFactory`. Aquí se ve claramente la inversión de dependencias: el
token es el **puerto** y la clase concreta es el **repositorio Prisma**.

```ts
// src/presentacion/bienes/bienes.module.ts
@Module({
  controllers: [BienesController],
  providers: [
    { provide: BienRepositoryPort, useClass: PrismaBienRepository },
    {
      provide: ListarBienesUseCase,
      useFactory: (repositorio: BienRepositoryPort) =>
        new ListarBienesUseCase(repositorio),
      inject: [BienRepositoryPort],
    },
  ],
})
export class BienesModule {}
```

Finalmente, el módulo raíz lo registra:

```ts
// src/app.module.ts
@Module({ imports: [PrismaModule, BienesModule, CatalogosModule, /* ... */] })
export class AppModule {}
```

## Flujo de una petición

Ejemplo de `GET /bienes`:

```mermaid
sequenceDiagram
    participant Cliente
    participant Controller as Controller (presentacion)
    participant Mapper as Mapper (presentacion)
    participant UseCase as UseCase (aplicacion)
    participant Puerto as BienRepositoryPort (dominio)
    participant Repo as PrismaBienRepository (infraestructura)
    participant DB as PostgreSQL

    Cliente->>Controller: GET /bienes?pagina=1
    Controller->>Mapper: toPaginacion(query)
    Mapper-->>Controller: Paginacion
    Controller->>UseCase: execute(paginacion)
    UseCase->>Puerto: listarPaginado(paginacion)
    Puerto-->>Repo: (implementación concreta)
    Repo->>DB: SELECT ...
    DB-->>Repo: filas
    Repo-->>UseCase: PaginaBienResumen
    UseCase-->>Controller: PaginaBienResumen
    Controller-->>Cliente: 200 JSON
```

El `Controller` sólo depende del `UseCase`; el `UseCase` sólo conoce el `Puerto`. El
`Repo` Prisma se inyecta por debajo sin que las capas internas lo sepan.

## Reglas y convenciones del proyecto

- **El dominio no depende de NestJS.** Sin decoradores `@Injectable`, sin Prisma.
- **La aplicación no depende de Prisma ni de NestJS.** Sólo usa puertos y tipos del
  dominio; expone casos de uso con clases planas.
- **La infraestructura implementa los puertos del dominio.** Es la única capa con
  acceso a `PrismaService`.
- **La presentación orquesta, no decide.** Controllers finos, DTOs que validan,
  mappers que traducen y módulos que sólo arman dependencias.
- **El token de inyección es la clase del puerto** (p. ej. `BienRepositoryPort`), y
  `useFactory` construye los casos de uso.
- **Nombres en español** para carpetas, tipos y conceptos del negocio.
- **Manejo de errores.** Los errores de negocio extienden `DomainError`. Un filtro
  global (`DomainExceptionFilter`) los traduce a HTTP: `code === 'NOT_FOUND'` → `404`,
  cualquier otro → `400`.
- **Configuración global de HTTP** en `main.ts`: `ValidationPipe` con `whitelist` y
  `forbidNonWhitelisted` (propiedades desconocidas → `400`), y el filtro de dominio.

### Notas de persistencia e interacción

- Los **atributos** del bien son dinámicos según su naturaleza (marca, serie, RAM,
  etc.). Se almacenan como `TEXT` serializado y la infraestructura se encarga de
  serializar/deserializar; hacia afuera se exponen como objeto `Record<string, string>`.
- La **paginación** usa `pagina`/`por_pagina` (máx. 1000) y responde con
  `total`, `total_paginas` y los campos `siguiente`/`anterior` (número de página o
  `null`).
- El **filtrado** (estado, codificador, atributos) se resuelve en el **frontend**
  sobre los datos paginados, para soportar caché y modo offline (PWA).

## Módulos como ejemplo

Todos los módulos siguen el patrón anterior. Algunos casos:

| Módulo | Rol | Ejemplos de endpoints |
| --- | --- | --- |
| **Bienes** | Registro, listado y detalle de activos/materiales. | `GET /bienes`, `GET /bienes/:id`, `POST /bienes` |
| **Catálogos** | Codificadores (clasificación contable de bienes). | `GET /codificadores`, `GET /codificadores/detalle` |
| **Unidades** | Unidades organizacionales (dueñas del bien). | `GET /unidades` |
| **Personas** | Personas y usuarios (responsables y roles). | `GET /personas`, `GET /usuarios` |

## Checklist para agregar un módulo

1. `dominio/<modulo>/tipos/` — define tipos y enums del negocio.
2. `dominio/<modulo>/puertos/` — define el/los puertos (clases abstractas).
3. `dominio/<modulo>/errores/` — errores de negocio propios, si hacen falta.
4. `aplicacion/<modulo>/<caso-de-uso>/` — un caso de uso por operación.
5. `infraestructura/<modulo>/` — implementación Prisma de cada puerto.
6. `presentacion/<modulo>/` — DTOs, mappers, controller y `.module.ts`.
7. Registra el módulo en `app.module.ts`.
8. Verifica con `bun run build` y `bun run lint`.

## Notas de infraestructura

- **Prisma 7** con el driver adapter `@prisma/adapter-pg`; el cliente se genera en
  `src/generated/prisma`.
- `PrismaService` (`infraestructura/base-datos/`) abre y cierra la conexión en el
  ciclo de vida del módulo.
- Esquema en `prisma/schema.prisma`; migraciones en `prisma/migrations/`; datos demo
  reproducibles con `bun run db:seed`.
