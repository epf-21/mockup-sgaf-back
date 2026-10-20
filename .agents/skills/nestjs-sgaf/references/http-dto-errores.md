# HTTP, DTOs y errores

La capa de presentación adapta HTTP al caso de uso. No contiene reglas de negocio ni acceso a datos.

## Ciclo de una petición

```text
HTTP request
  -> ValidationPipe global
  -> Controller
  -> Mapper (DTO -> input)
  -> InputBoundary
  -> UseCase
  -> Port
  -> UseCase
  -> Controller
  -> JSON response
```

- `ValidationPipe` global está configurado en `src/main.ts` con `whitelist`, `forbidNonWhitelisted` y `transform`.
- `DomainExceptionFilter` global traduce errores de dominio a HTTP.
- Si la validación falla, Nest responde 400 antes de ejecutar el caso de uso.

## Controller

```ts
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CerrarTareaInputBoundary } from '../../aplicacion/tareas/use-cases/cerrar-tarea/cerrar-tarea.input-boundary';
import { CrearTareaInputBoundary } from '../../aplicacion/tareas/use-cases/crear-tarea/crear-tarea.input-boundary';
import { ListarTareasInputBoundary } from '../../aplicacion/tareas/use-cases/listar-tareas/listar-tareas.input-boundary';
import { ObtenerTareaInputBoundary } from '../../aplicacion/tareas/use-cases/obtener-tarea/obtener-tarea.input-boundary';
import { CerrarTareaBody } from './dto/cerrar-tarea.body';
import { CrearTareaBody } from './dto/crear-tarea.body';
import { ListarTareasQuery } from './dto/listar-tareas.query';
import { CrearTareaMapper } from './mappers/crear-tarea.mapper';
import { ListarTareasMapper } from './mappers/listar-tareas.mapper';

@Controller('tareas')
export class TareasController {
  constructor(
    @Inject(ListarTareasInputBoundary)
    private readonly listarTareas: ListarTareasInputBoundary,
    @Inject(CrearTareaInputBoundary)
    private readonly crearTarea: CrearTareaInputBoundary,
    @Inject(ObtenerTareaInputBoundary)
    private readonly obtenerTarea: ObtenerTareaInputBoundary,
    @Inject(CerrarTareaInputBoundary)
    private readonly cerrarTarea: CerrarTareaInputBoundary,
  ) {}

  @Get()
  getTareas(@Query() query: ListarTareasQuery) {
    return this.listarTareas.execute(ListarTareasMapper.toPaginacion(query));
  }

  @Get(':id')
  getDetalle(@Param('id', ParseUUIDPipe) id: string) {
    return this.obtenerTarea.execute(id);
  }

  @Post()
  crear(@Body() body: CrearTareaBody) {
    return this.crearTarea.execute(CrearTareaMapper.bodyToInput(body));
  }

  @Patch(':id/cerrar')
  cerrar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CerrarTareaBody,
  ) {
    return this.cerrarTarea.execute({
      tareaId: id,
      usuarioId: body.usuario_id,
    });
  }
}
```

Reglas:

- Inyecta boundaries, no casos de uso concretos ni ports.
- Usa `ParseUUIDPipe` en parámetros `:id`.
- El controller puede mapear inline para acciones simples; si crece, crea un mapper.
- No uses `@Res()` salvo que necesites control total de la respuesta.
- No devuelvas modelos Prisma.
- Los nombres de ruta van en español y `kebab-case`.

## DTOs

### Body

```ts
import { Type, Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsBoolean,
  IsIn,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

const toNumber = ({ value }: { value: unknown }) => {
  if (value === null || value === undefined || value === '') return value;
  return typeof value === 'number' ? value : Number(value);
};

export class CrearComponenteBody {
  @IsUUID('4')
  codificador_id!: string;

  @IsString()
  @Length(1, 500)
  descripcion!: string;

  @IsObject()
  atributos!: Record<string, unknown>;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  valor_original?: number | null;
}

export class CrearBienBody {
  @IsUUID('4')
  codificador_id!: string;

  @IsString()
  @Length(1, 500)
  descripcion!: string;

  @IsOptional()
  @IsIn(['excelente', 'muy_bueno', 'bueno', 'regular', 'malo'])
  estado_fisico?: string | null;

  @IsISO8601({}, { message: 'debe tener formato YYYY-MM-DD' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'debe tener formato YYYY-MM-DD',
  })
  fecha_alta!: string;

  @IsOptional()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CrearComponenteBody)
  componentes?: CrearComponenteBody[];
}
```

Convenciones:

- Propiedades HTTP en `snake_case`: `unidad_id`, `fecha_alta`, `usuario_id`.
- El input del caso de uso usa `camelCase`; el mapper traduce.
- No agregues lógica de negocio en el DTO.
- Usa `!` en propiedades requeridas si `strictPropertyInitialization` lo requiere.
- No uses `any`; usa `Record<string, unknown>` para objetos libres.

### Query y paginación

```ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListarBienesQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  por_pagina?: number;
}
```

Defaults en el mapper, no en el DTO:

```ts
const PAGINA_DEFAULT = 1;
const POR_PAGINA_DEFAULT = 10;

export class ListarBienesMapper {
  static toPaginacion(query: ListarBienesQuery): Paginacion {
    return {
      pagina: query.pagina ?? PAGINA_DEFAULT,
      porPagina: query.por_pagina ?? POR_PAGINA_DEFAULT,
    };
  }
}
```

Forma de respuesta paginada:

```json
{
  "datos": [],
  "total": 0,
  "pagina": 1,
  "por_pagina": 10,
  "total_paginas": 1,
  "siguiente": null,
  "anterior": null
}
```

Reglas:

- `pagina` mínimo 1; `por_pagina` entre 1 y 1000.
- `total_paginas` nunca menor que 1.
- `siguiente` y `anterior` son `null` en los extremos.
- No devuelvas `total_paginas: 0` cuando no hay datos; el proyecto usa mínimo 1.

## Validaciones frecuentes

| Necesidad | Decorador |
| --- | --- |
| UUID v4 | `@IsUUID('4')` |
| Entero desde query string | `@Type(() => Number)` + `@IsInt()` |
| Número desde body/query string | `@Transform(toNumber)` + `@IsNumber()` |
| Texto con longitud | `@IsString()` + `@Length(1, 500)` |
| Enum cerrado | `@IsIn([...])` |
| Booleano | `@IsBoolean()` |
| Fecha `YYYY-MM-DD` | `@IsISO8601()` + `@Matches(/^\d{4}-\d{2}-\d{2}$/)` |
| Objeto libre | `@IsObject()` |
| Array anidado | `@ValidateNested({ each: true })` + `@Type(() => Hijo)` |
| Campo opcional | `@IsOptional()` |
| Lista con máximo | `@ArrayMaxSize(50)` |

Notas:

- `@IsOptional()` omite la validación si el valor es `null` o `undefined`; normaliza en el mapper.
- `whitelist` elimina propiedades no declaradas y `forbidNonWhitelisted` hace que las propiedades extra devuelvan 400. No agregues campos “por si acaso”.
- Para IDs usa UUID, no `@IsString()`, salvo que el contrato use otro formato.
- Para enums, imita el módulo vecino: el proyecto suele usar `@IsIn` con literales en el DTO.

## Mappers

```ts
import type { CrearBienBody } from '../dto/crear-bien.body';
import type { CrearBienInput } from '../../../aplicacion/bienes/use-cases/crear-bien/crear-bien.input';

export class CrearBienMapper {
  static bodyToInput(body: CrearBienBody): CrearBienInput {
    return {
      codificadorId: body.codificador_id,
      descripcion: body.descripcion,
      unidadId: body.unidad_id,
      responsableId: body.responsable_id,
      fechaAlta: body.fecha_alta,
      componentes: body.componentes?.map((c) => ({
        codificadorId: c.codificador_id,
        descripcion: c.descripcion,
        atributos: c.atributos,
      })),
    };
  }
}
```

Reglas:

- Métodos estáticos y sin estado.
- Traduce nombres (`snake_case` -> `camelCase`) y normaliza `undefined` a `null` cuando el input lo espera.
- No valida reglas de negocio; eso es del caso de uso o de la entidad.
- No accede a base de datos.

## Errores

### Jerarquía

```text
DomainError
  ├── BusinessRuleError  (code: BUSINESS_RULE_VIOLATION)
  └── NotFoundError      (code: NOT_FOUND)
```

- `BusinessRuleError` para reglas de negocio violadas.
- `NotFoundError` para recursos inexistentes.
- Los errores específicos heredan de uno de estos y declaran su propio `code`.
- Los errores compartidos viven en `src/dominio/comun/errores/`; los de módulo en `src/dominio/<modulo>/errores/`.

### Filtro global

`src/infraestructura/comun/http-exception.filter.ts`:

```ts
@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception.code === 'NOT_FOUND'
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
      code: exception.code,
      path: request.url,
    });
  }
}
```

Respuesta típica:

```json
{
  "statusCode": 400,
  "message": "El rol \"supervisor\" no puede realizar la acción \"cerrar la tarea\"",
  "error": "RolTareaNoAutorizadoError",
  "code": "BUSINESS_RULE_VIOLATION",
  "path": "/tareas/123/cerrar"
}
```

Reglas:

- No lances `HttpException` desde dominio ni aplicación.
- En el controller puedes usar excepciones HTTP de Nest para problemas exclusivamente HTTP (por ejemplo, `ParseUUIDPipe`).
- No expongas mensajes de Prisma, SQL ni detalles internos.
- Si una restricción de unicidad es una regla de negocio, tradúcela en infraestructura a un error de dominio.
- No captures `DomainError` en el controller; el filtro global ya lo hace.

## Códigos de estado

| Operación | Código |
| --- | --- |
| `GET` | 200 |
| `POST` | 201 (default de Nest) |
| `PATCH` | 200 |
| `DELETE` | 200, o 204 si no devuelves body |
| Validación fallida | 400 |
| Recurso inexistente | 404 |
| Error inesperado | 500 |

No agregues `@HttpCode` salvo que necesites un código distinto al default.

## Guards, interceptors, pipes y filters

Actualmente el proyecto usa:

- `ValidationPipe` global en `src/main.ts`.
- `DomainExceptionFilter` global en `src/main.ts`.
- `ParseUUIDPipe` en parámetros.

Si agregas comportamiento transversal:

- Guards: autorización/autenticación a nivel de ruta o global. No pongas reglas de negocio de roles en el guard; el caso de uso sigue siendo la fuente de verdad.
- Interceptors: logging, transformación de respuesta o tiempos. No cambies el contrato sin actualizar la documentación.
- Pipes: parseo/transformación de parámetros. Prefiere los built-in (`ParseUUIDPipe`, `ParseIntPipe`).
- Filters: traducción de excepciones a HTTP. Mantén el filtro de dominio y agrega filtros específicos solo si no se solapan.

Ubicación recomendada: `src/infraestructura/comun/` para adaptadores técnicos y `src/presentacion/comun/` si es estrictamente HTTP. Regístralos en `main.ts` si son globales o en el módulo correspondiente.

## Checklist HTTP

- [ ] El controller inyecta boundaries con `@Inject`.
- [ ] Los IDs usan `ParseUUIDPipe`.
- [ ] El body tiene DTO con decoradores.
- [ ] La query tiene DTO y defaults en el mapper.
- [ ] El mapper traduce `snake_case` -> `camelCase`.
- [ ] Las reglas de negocio lanzan errores de dominio.
- [ ] No se devuelven modelos Prisma.
- [ ] El endpoint no duplica `ValidationPipe` ni el filtro global.
