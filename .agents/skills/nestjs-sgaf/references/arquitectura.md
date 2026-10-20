# Arquitectura

Documento de apoyo para decidir dónde vive cada pieza. La fuente canónica es `docs/ARCHITECTURE.md`; esta referencia resume lo que un agente necesita para editar sin romper el diseño.

## Regla de dependencia

```text
presentacion  ->  aplicacion  ->  dominio
      |                ^             ^
      |                |             |
      +-->  infraestructura ---------+
```

- `presentacion` conoce `aplicacion` y los DTOs; no conoce Prisma.
- `aplicacion` conoce `dominio`; no conoce NestJS ni Prisma.
- `infraestructura` conoce `aplicacion` y `dominio`, y usa Prisma; implementa los ports de aplicación.
- `dominio` no conoce a nadie. Es el centro.
- El módulo Nest (en `presentacion`) es el composition root: une casos de uso, ports y adaptadores.

## Las cuatro capas

| Capa | Responsabilidad | Puede importar |
| --- | --- | --- |
| Dominio | Entidades, invariantes, errores y tipos | Solo TypeScript y otros archivos de dominio |
| Aplicación | Orquestar casos de uso, definir ports y validar reglas de aplicación | Dominio |
| Infraestructura | Implementar persistencia, reloj, filtros y adaptadores | Aplicación, dominio, Prisma, NestJS |
| Presentación | Exponer HTTP, validar entrada y ensamblar dependencias | Aplicación, dominio (tipos/errores), NestJS |

### Señales de una violación

- `import { Injectable } from '@nestjs/common'` en `dominio/` o `aplicacion/`.
- `import { PrismaService }` en `aplicacion/` o `presentacion/`.
- `dominio/` importando `aplicacion/` o `infraestructura/`.
- `prisma.*` dentro de un controller.
- Un caso de uso que recibe `Request` o `Response`.
- Un DTO usado como entidad de dominio.
- Un mapper que decide reglas de negocio.

## Dominio

### Entidades

Las entidades concentran invariantes y cálculos. Ejemplo real: `Bien.crear()` valida descripción y responsable, y calcula `patrimonial` según el origen.

```ts
export class Bien {
  private constructor(
    readonly descripcion: string,
    readonly responsableId: string,
    readonly origenTipo: OrigenTipo,
    readonly patrimonial: boolean,
  ) {}

  static crear(datos: DatosCreacionBien): Bien {
    const descripcion = (datos.descripcion ?? '').trim();
    if (descripcion.length === 0) {
      throw new DescripcionBienRequeridaError();
    }
    if (!datos.responsableId) {
      throw new ResponsableBienRequeridoError();
    }
    return new Bien(
      descripcion,
      datos.responsableId,
      datos.origenTipo,
      Bien.calcularPatrimonial(datos.origenTipo, datos.patrimonial),
    );
  }
}
```

Buenas prácticas:

- Constructor privado + factory estática cuando hay validación.
- Campos `readonly`.
- Métodos con nombres de negocio (`calcularPatrimonial`, `puedeCerrarse`).
- Errores específicos, no `Error` genérico.
- No retornar entidades Prisma desde dominio.

### Errores

Los errores heredan de `DomainError` directamente o vía `BusinessRuleError`/`NotFoundError`, y exponen un `code` estable.

```ts
import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class ProcesoSinBienesError extends BusinessRuleError {
  constructor() {
    super('El tipo de proceso requiere al menos un bien');
  }
}
```

Reglas:

- `BusinessRuleError` para violaciones de reglas; `NotFoundError` para recursos inexistentes.
- El `DomainExceptionFilter` mapea `NOT_FOUND` a 404 y el resto a 400. Si heredas de `NotFoundError`, conserva el code `NOT_FOUND` o actualiza el filtro.
- No incluyas detalles internos, SQL ni stack traces en el mensaje.
- Los errores compartidos viven en `src/dominio/comun/errores/`.

### Ports

Un `Port` es una clase abstracta en la capa de aplicación que describe una capacidad de salida. Los ports de persistencia se llaman `Repository`.

```ts
import type { NuevoBien, Paginacion } from '../../../../dominio/bienes/tipos/bien';
import type { CrearBienOutput } from '../use-cases/crear-bien/crear-bien.output';
import type { ListarBienesOutput } from '../use-cases/listar-bienes/listar-bienes.output';
import type { ObtenerDetalleBienOutput } from '../use-cases/obtener-detalle-bien/obtener-detalle-bien.output';

export abstract class BienRepository {
  abstract listarPaginado(paginacion: Paginacion): Promise<ListarBienesOutput>;
  abstract obtenerDetalle(id: string): Promise<ObtenerDetalleBienOutput | null>;
  abstract crearConComponentes(
    padre: NuevoBien,
    componentes: NuevoBien[],
  ): Promise<CrearBienOutput>;
}
```

Reglas:

- Nombre `XRepository`; archivo `x.repository.ts` dentro de `aplicacion/<modulo>/ports/`.
- Los ports que no son de persistencia usan el sufijo `.port.ts` y también viven en `aplicacion/<modulo>/ports/`.
- Las entradas usan tipos de dominio; las salidas usan los `*.output.ts` del caso de uso. Nunca tipos Prisma ni `any`.
- Devuelve `null` para “no encontrado” cuando el caso de uso decide el error.
- Separa referencias externas en un port propio (`ReferenciasBienRepository`) para no mezclar persistencia con validación de catálogos.

### Tipos

Los tipos e enums de dominio viven en `dominio/<modulo>/tipos/`. Usa `interface` para estructuras y `enum` para valores cerrados.

```ts
export enum AccionProceso {
  Autorizar = 'autorizar',
  Rechazar = 'rechazar',
  IniciarEjecucion = 'iniciar_ejecucion',
  Cerrar = 'cerrar',
}
```

## Aplicación

Cada operación tiene cuatro archivos en `aplicacion/<modulo>/use-cases/<accion>/`:

```text
cerrar-tarea.input.ts
cerrar-tarea.input-boundary.ts
cerrar-tarea.output.ts
cerrar-tarea.use-case.ts
```

### Input

Objeto plano con los datos que necesita el caso de uso. Usa `camelCase` aunque el DTO HTTP use `snake_case`; el mapper hace la traducción.

```ts
export interface CerrarTareaInput {
  tareaId: string;
  usuarioId: string;
}
```

### Output

Contrato de salida del caso de uso. Define el retorno del método principal y, si
existen, el de los métodos internos que devuelven datos. Los modelos de lectura ya no
viven en `dominio/`.

```ts
export interface TareaUsuarioDetalleOutput {
  usuario_id: string;
  nombre_completo: string;
  email: string;
}

export interface CerrarTareaOutput {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  estado: string;
  gestion: number;
  fecha_inicio: Date;
  fecha_finalizacion: Date | null;
  creado_por: TareaUsuarioDetalleOutput;
  supervisores: TareaUsuarioDetalleOutput[];
  inventariadores: TareaUsuarioDetalleOutput[];
  procesos: {
    id: string;
    codigo: string | null;
    estado: string;
    tipo: { codigo: string; nombre: string };
    fecha_autorizacion: Date | null;
    fecha_cierre: Date | null;
  }[];
}
```

### InputBoundary

Contrato abstracto que implementa el caso de uso y consume el controller.

```ts
import type { CerrarTareaInput } from './cerrar-tarea.input';
import type { CerrarTareaOutput } from './cerrar-tarea.output';

export abstract class CerrarTareaInputBoundary {
  abstract execute(input: CerrarTareaInput): Promise<CerrarTareaOutput>;
}
```

### Caso de uso

Clase plana que implementa el boundary y recibe ports por constructor.

```ts
import type { CerrarTareaOutput } from './cerrar-tarea.output';

export class CerrarTareaUseCase implements CerrarTareaInputBoundary {
  constructor(
    private readonly tareas: TareaRepository,
    private readonly referencias: ReferenciasTareaRepository,
    private readonly reloj: Reloj,
  ) {}

  async execute(input: CerrarTareaInput): Promise<CerrarTareaOutput> {
    const tarea = await this.tareas.obtenerDetalle(input.tareaId);
    if (!tarea) {
      throw new TareaNoEncontradaError(input.tareaId);
    }

    await this.tareas.cerrar(input.tareaId, this.reloj.ahora());

    const actualizada = await this.tareas.obtenerDetalle(input.tareaId);
    if (!actualizada) {
      throw new TareaNoEncontradaError(input.tareaId);
    }

    return actualizada;
  }
}
```

El ejemplo omite la validación de usuario y rol para mantenerlo corto; la versión completa está en `src/aplicacion/tareas/use-cases/cerrar-tarea/cerrar-tarea.use-case.ts`.

Reglas:

- Sin decoradores, sin `@Injectable`, sin `Request`.
- Orquesta: valida referencias, construye entidades, llama ports, decide errores.
- No arma respuestas HTTP ni conoce códigos de estado.
- No hace `try/catch` de Prisma; deja que la infraestructura traduzca o propague.
- Un caso de uso por operación; evita “god use cases”.

## Infraestructura

### Repository Prisma

Implementa el contrato de aplicación y concentra el acceso a datos.

```ts
@Injectable()
export class PrismaBienRepository implements BienRepository {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerDetalle(id: string): Promise<ObtenerDetalleBienOutput | null> {
    const bien = await this.prisma.bien.findUnique({
      where: { id },
      include: {
        codificador: { select: { id: true, codigo: true, nombre: true } },
        responsable: { select: { id: true, nombre_completo: true } },
      },
    });
    if (!bien) return null;
    return this.aDetalle(bien);
  }
}
```

Reglas:

- Archivo `prisma-<modulo>.repository.ts` en `infraestructura/<modulo>/`.
- `@Injectable()` obligatorio para que Nest lo resuelva.
- Usa `select`/`include` explícitos; evita cargar columnas innecesarias.
- Traduce modelos Prisma a los tipos de salida (`*.output.ts`) con funciones privadas.
- Usa transacciones (`this.prisma.$transaction`) para operaciones compuestas.
- No lances errores HTTP; si una violación de unicidad es regla de negocio, tradúcela a un error de dominio.
- Importa el cliente desde `src/generated/prisma/client`, no desde `@prisma/client`.

### Adaptadores transversales

- `RelojSistema` implementa `Reloj` desde `aplicacion/comun/ports/reloj.port.ts`; se inyecta como `Reloj`.
- `DomainExceptionFilter` vive en `infraestructura/comun/`.
- Un adaptador nuevo (correo, archivos, mensajería) sigue el mismo patrón: contrato en aplicación, implementación en infraestructura, provider en el módulo.

## Presentación

### Controller

Adaptador HTTP delgado:

```ts
@Controller('bienes')
export class BienesController {
  constructor(
    @Inject(CrearBienInputBoundary)
    private readonly crearBien: CrearBienInputBoundary,
  ) {}

  @Post()
  crear(@Body() body: CrearBienBody) {
    return this.crearBien.execute(CrearBienMapper.bodyToInput(body));
  }
}
```

Reglas:

- `@Inject(Boundary)` siempre que el token sea una clase abstracta.
- `@Param('id', ParseUUIDPipe)` para IDs UUID.
- No acceder a `PrismaService` ni a ports.
- No calcular reglas; solo mapear y delegar.
- Un controller por recurso o por grupo coherente de rutas.

### DTO

- `*.body.ts` para cuerpos de request.
- `*.query.ts` para query strings.
- Propiedades en `snake_case` para reflejar el contrato HTTP.
- Decoradores de `class-validator` y `class-transformer`.
- Sin lógica de negocio.

### Mapper

Traduce DTO -> input y query -> paginación. Es una clase con métodos estáticos.

```ts
export class CrearBienMapper {
  static bodyToInput(body: CrearBienBody): CrearBienInput {
    return {
      codificadorId: body.codificador_id,
      descripcion: body.descripcion,
      unidadId: body.unidad_id,
      responsableId: body.responsable_id,
    };
  }
}
```

### Módulo

Registra controllers y providers. Para el detalle de DI, consulta `modulo-di.md`.

```ts
@Module({
  controllers: [BienesController],
  providers: [
    { provide: BienRepository, useClass: PrismaBienRepository },
    {
      provide: ReferenciasBienRepository,
      useClass: PrismaReferenciasBienRepository,
    },
    {
      provide: CrearBienInputBoundary,
      useFactory: (bienes: BienRepository, referencias: ReferenciasBienRepository) =>
        new CrearBienUseCase(bienes, referencias),
      inject: [BienRepository, ReferenciasBienRepository],
    },
  ],
})
export class BienesModule {}
```

## Flujo de una petición

```text
HTTP -> ValidationPipe -> Controller -> Mapper -> InputBoundary
     -> UseCase -> Port -> PrismaService -> PostgreSQL
     -> UseCase -> Controller -> respuesta JSON
```

- Si el caso de uso lanza `DomainError`, el filtro global responde 400/404.
- Si `ValidationPipe` rechaza el body, Nest responde 400 antes de llegar al controller.
- Si Prisma falla por una restricción no traducida, responde 500; solo traduce cuando sea una regla de negocio esperada.

## Convenciones de nombres

- Carpetas y archivos en español, `kebab-case`: `crear-bien`, `prisma-bien.repository.ts`.
- Clases en `PascalCase`: `CrearBienUseCase`, `BienRepository`, `CrearBienBody`.
- Métodos y variables en `camelCase`.
- Columnas y DTOs HTTP en `snake_case`.
- Un caso de uso por acción: `crear-`, `listar-`, `obtener-`, `cerrar-`, `transicionar-`.
- No mezcles inglés y español en el mismo identificador nuevo; imita el módulo vecino.

## Checklist para un módulo nuevo

1. Tipos y entidad en `dominio/<modulo>/`.
2. Errores específicos en `dominio/<modulo>/errores/`.
3. Ports en `aplicacion/<modulo>/ports/`.
4. Inputs, outputs, boundaries y use cases en `aplicacion/<modulo>/use-cases/`.
5. Implementaciones Prisma en `infraestructura/<modulo>/`.
6. DTOs, mappers, controller y módulo en `presentacion/<modulo>/`.
7. Registro en `presentacion/<modulo>/<modulo>.module.ts` y en `src/app.module.ts`.
8. `bun run build` y `bun run lint`.

Para ejemplos completos, revisa `src/presentacion/bienes/`, `src/presentacion/tareas/` y `src/presentacion/procesos/`.
