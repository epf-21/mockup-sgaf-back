# Recetas

Recetas concretas para las tareas más frecuentes. Antes de empezar, lee el módulo vecino que más se parezca; casi todo tiene un patrón existente.

## 1. Agregar una operación de lectura (listar u obtener)

**Ejemplo:** listar elementos paginados.

1. Define la salida en `aplicacion/<modulo>/output/listar-<x>.output.ts`.
2. Agrega el método al port en `aplicacion/<modulo>/ports/`.
3. Crea el input si hay filtros:
   `aplicacion/<modulo>/input/listar-<x>.input.ts`
4. Crea el boundary:
   `aplicacion/<modulo>/input-boundary/listar-<x>.input-boundary.ts`
5. Crea el caso de uso:
   `aplicacion/<modulo>/use-case/listar-<x>.use-case.ts`
6. Implementa el método en `infraestructura/<modulo>/prisma-<modulo>.repository.ts`.
7. Registra el boundary con `useFactory` en el módulo.
8. Crea `presentacion/<modulo>/dto/listar-<x>.query.ts`.
9. Crea `presentacion/<modulo>/mappers/listar-<x>.mapper.ts`.
10. Agrega `@Get()` en el controller.
11. `bun run build` y `bun run lint`.

Boundary:

```ts
import type { ListarElementosInput } from '../input/listar-elementos.input';
import type { ListarElementosOutput } from '../output/listar-elementos.output';

export abstract class ListarElementosInputBoundary {
  abstract execute(input: ListarElementosInput): Promise<ListarElementosOutput>;
}
```

Caso de uso:

```ts
import type { ListarElementosOutput } from '../output/listar-elementos.output';

export class ListarElementosUseCase implements ListarElementosInputBoundary {
  constructor(private readonly elementos: ElementoRepository) {}

  execute(input: ListarElementosInput): Promise<ListarElementosOutput> {
    return this.elementos.listarPaginado(input);
  }
}
```

## 2. Agregar una operación de escritura (crear)

**Ejemplo:** crear un elemento.

1. Define el input en `aplicacion/<modulo>/input/crear-<x>.input.ts`.
2. Define la salida en `aplicacion/<modulo>/output/crear-<x>.output.ts`.
3. Crea el boundary con `execute(input): Promise<...>`.
4. Crea el caso de uso. Debe:
   - validar referencias con un port de referencias;
   - construir la entidad de dominio;
   - llamar al port de persistencia.
5. Agrega el método de escritura al port de aplicación.
6. Impleméntalo en infraestructura con `create`/`$transaction`.
7. Agrega el provider `useFactory` en el módulo.
8. Crea `dto/crear-<x>.body.ts` con `class-validator`.
9. Crea `mappers/crear-<x>.mapper.ts`.
10. Agrega `@Post()` en el controller.
11. Compila y lint.

Esqueleto:

```ts
export class CrearElementoUseCase implements CrearElementoInputBoundary {
  constructor(
    private readonly elementos: ElementoRepository,
    private readonly referencias: ReferenciasElementoRepository,
  ) {}

  async execute(input: CrearElementoInput): Promise<CrearElementoOutput> {
    if (!(await this.referencias.unidadExiste(input.unidadId))) {
      throw new NotFoundError(`Unidad no encontrada: ${input.unidadId}`);
    }

    const elemento = Elemento.crear({
      descripcion: input.descripcion,
      unidadId: input.unidadId,
    });

    return this.elementos.crear(elemento);
  }
}
```

Reglas:

- El caso de uso decide qué es un error de negocio.
- La entidad valida invariantes.
- El repositorio no decide reglas; solo persiste.
- El controller no valida reglas, solo el formato.

## 3. Agregar un método a un repositorio Prisma

1. Declara el método abstracto en `aplicacion/<modulo>/ports/<x>.repository.ts`.
2. Implementa en `infraestructura/<modulo>/prisma-<x>.repository.ts`.
3. Usa `select`/`include` explícitos.
4. Traduce el resultado a los tipos de salida (`*.output.ts`) de aplicación.
5. Si es escritura compuesta, usa `this.prisma.$transaction`.
6. Si hay unicidad esperada, traduce el error de Prisma a un error de dominio.

Ejemplo de transacción:

```ts
async crearConMovimientos(
  proceso: NuevoProceso,
): Promise<CrearProcesoOutput> {
  return this.prisma.$transaction(async (tx) => {
    const creado = await tx.proceso.create({
      data: {
        tarea_id: proceso.tarea_id,
        tipo_proceso_id: proceso.tipo_proceso_id,
        gestion: proceso.gestion,
        estado: proceso.estado,
        descripcion: proceso.descripcion,
        movimientos: {
          create: proceso.movimientos.map((movimiento) => ({
            bien_id: movimiento.bien_id,
            unidad_destino_id: movimiento.unidad_destino_id,
            responsable_destino_id: movimiento.responsable_destino_id,
            motivo: movimiento.motivo,
          })),
        },
      },
      include: { tipo_proceso: true, tarea: true, movimientos: true },
    });

    return this.aCrearProcesoOutput(creado);
  });
}
```

No uses transacciones interactivas largas si no son necesarias. No mezcles llamadas HTTP dentro de una transacción.

## 4. Agregar un módulo nuevo de punta a punta

**Ejemplo:** módulo `elementos`.

Archivos mínimos:

```text
src/dominio/elementos/
  entidades/elemento.entity.ts
  errores/descripcion-requerida.error.ts
  tipos/elemento.ts

src/aplicacion/elementos/
  ports/elemento.repository.ts
  input/
    crear-elemento.input.ts
    listar-elementos.input.ts
  input-boundary/
    crear-elemento.input-boundary.ts
    listar-elementos.input-boundary.ts
  output/
    crear-elemento.output.ts
    listar-elementos.output.ts
  use-case/
    crear-elemento.use-case.ts
    listar-elementos.use-case.ts

src/infraestructura/elementos/
  prisma-elemento.repository.ts

src/presentacion/elementos/
  dto/crear-elemento.body.ts
  dto/listar-elementos.query.ts
  mappers/crear-elemento.mapper.ts
  mappers/listar-elementos.mapper.ts
  elementos.controller.ts
  elementos.module.ts
```

Pasos:

1. Crea dominio y aplicación.
2. Crea infraestructura.
3. Crea presentación.
4. Registra `ElementosModule` en `src/app.module.ts`.
5. Compila.

Módulo:

```ts
@Module({
  controllers: [ElementosController],
  providers: [
    { provide: ElementoRepository, useClass: PrismaElementoRepository },
    {
      provide: CrearElementoInputBoundary,
      useFactory: (elementos: ElementoRepository) =>
        new CrearElementoUseCase(elementos),
      inject: [ElementoRepository],
    },
    {
      provide: ListarElementosInputBoundary,
      useFactory: (elementos: ElementoRepository) =>
        new ListarElementosUseCase(elementos),
      inject: [ElementoRepository],
    },
  ],
})
export class ElementosModule {}
```

`AppModule`:

```ts
imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  PrismaModule,
  ElementosModule,
],
```

## 5. Inyectar el reloj

No uses `new Date()` dentro de casos de uso. Inyecta `Reloj` para poder controlar el tiempo.

1. El contrato ya existe en `src/aplicacion/comun/ports/reloj.port.ts`.
2. El adaptador ya existe en `src/infraestructura/comun/reloj-sistema.ts`.
3. Declara el provider en el módulo:

```ts
{ provide: Reloj, useClass: RelojSistema }
```

4. Inyéctalo en la factory:

```ts
{
  provide: CerrarElementoInputBoundary,
  useFactory: (
    elementos: ElementoRepository,
    reloj: Reloj,
  ) => new CerrarElementoUseCase(elementos, reloj),
  inject: [ElementoRepository, Reloj],
}
```

5. En el caso de uso:

```ts
constructor(
  private readonly elementos: ElementoRepository,
  private readonly reloj: Reloj,
) {}

async execute(id: string): Promise<void> {
  await this.elementos.cerrar(id, this.reloj.ahora());
}
```

## 6. Agregar un error de dominio

1. Decide si es `BusinessRuleError` o `NotFoundError`.
2. Crea el archivo en `dominio/<modulo>/errores/` o `dominio/comun/errores/`.
3. Declara un `code` estable en mayúsculas.
4. Lánzalo desde la entidad o el caso de uso.
5. No toques el filtro si usas `NOT_FOUND` o el mapeo por defecto a 400.

```ts
import { BusinessRuleError } from '../../comun/errores/business-rule.error';

export class ElementoYaCerradoError extends BusinessRuleError {
  readonly code = 'ELEMENTO_YA_CERRADO';
  constructor() {
    super('El elemento ya está cerrado');
  }
}
```

Si necesitas un código HTTP distinto de 400/404, actualiza `DomainExceptionFilter` y documenta el cambio. Evítalo si puedes resolverlo con los códigos existentes.

## 7. Agregar paginación

1. DTO de query con `pagina` y `por_pagina`.
2. Mapper con `normalizarPaginacion` (defaults `1` y `10`).
3. Port con `skip`/`take` y `count` en paralelo.
4. Respuesta con la forma estándar.

```ts
import { calcularOffset, crearPaginaOutput } from '../../aplicacion/comun/paginacion/paginacion';

const skip = calcularOffset(paginacion);

const [total, filas] = await Promise.all([
  this.prisma.elemento.count({ where }),
  this.prisma.elemento.findMany({
    where,
    orderBy: { id: 'asc' },
    skip,
    take: paginacion.porPagina,
  }),
]);

return crearPaginaOutput(
  filas.map((fila) => this.aResumen(fila)),
  total,
  paginacion,
);
```

## 8. Agregar una transición de estado

Usa la entidad de workflow existente; no dupliques la tabla de transiciones en el caso de uso.

1. Si la acción es nueva, agrega el valor a `AccionProceso` o al enum correspondiente.
2. Agrega un método en la entidad (`autorizar`, `rechazar`, `cerrar`, etc.) que valide el estado actual y devuelva los cambios.
3. El caso de uso:
   - carga los datos con el port;
   - reconstruye la entidad (`ProcesoWorkflow.desde(...)`);
   - llama al método de dominio;
   - pasa los cambios al port para persistir en una transacción.
4. Agrega el endpoint `PATCH` con su DTO.
5. Prueba manualmente solo si el usuario lo pide.

Patrón:

```ts
const datos = await this.procesos.obtenerParaWorkflow(procesoId);
if (!datos) throw new NotFoundError(`Proceso no encontrado: ${procesoId}`);

const workflow = ProcesoWorkflow.desde(datos);
const cambios = workflow.autorizar(usuarioId, this.reloj.ahora(), observacion);

await this.procesos.aplicarCambios(procesoId, cambios);
```

No pongas `if (estado === ...)` de negocio en el caso de uso si la entidad ya lo valida.

## 9. Agregar un controller secundario

Si un recurso tiene subrutas claras (por ejemplo, movimientos dentro de procesos), puedes usar un controller separado en el mismo módulo.

1. Crea `presentacion/<modulo>/<subrecurso>.controller.ts`.
2. Inyecta los boundaries que necesite.
3. Agrega el controller a `controllers` del módulo.
4. No dupliques lógica: reutiliza casos de uso.

```ts
@Controller('movimientos')
export class MovimientosController {
  constructor(
    @Inject(CompletarMovimientoInputBoundary)
    private readonly completar: CompletarMovimientoInputBoundary,
  ) {}

  @Patch(':id/completar')
  completarMovimiento(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CompletarMovimientoBody,
  ) {
    return this.completar.execute({
      movimientoId: id,
      observacion: body.observacion ?? null,
    });
  }
}
```

## 10. Refactorizar un controller gordo

Señales:

- Importa `PrismaService`.
- Tiene `if` de reglas de negocio.
- Hace varias consultas antes de llamar a un caso de uso.
- Arma respuestas complejas con lógica condicional.

Pasos:

1. Extrae la regla a dominio o a un caso de uso.
2. Crea el input y el boundary.
3. Mueve la orquestación al caso de uso.
4. Deja en el controller: decoradores, DTO, mapper y una llamada.
5. Compila y lint.

## 11. Verificación manual segura

Solo si el usuario lo pide o autoriza:

```bash
curl -s http://localhost:3000/elementos?pagina=1\&por_pagina=10
curl -s -X POST http://localhost:3000/elementos \
  -H 'Content-Type: application/json' \
  -d '{"descripcion":"Prueba","unidad_id":"<uuid>"}'
```

Buenas prácticas:

- Usa datos de prueba identificables.
- Limpia los registros creados al terminar.
- No borres datos existentes.
- No ejecutes seeds ni migraciones para “arreglar” el entorno.
- Si el puerto 3000 está ocupado, identifica el proceso antes de matarlo.

## Checklist de cualquier receta

- [ ] La regla está en la capa correcta.
- [ ] El caso de uso no conoce NestJS/Prisma.
- [ ] Las salidas están en `aplicacion/<modulo>/output/*.output.ts`.
- [ ] El controller solo adapta HTTP.
- [ ] El port tiene contrato abstracto e implementación Prisma.
- [ ] El provider está registrado con `useFactory` + `inject`.
- [ ] El módulo está en `AppModule` si es nuevo.
- [ ] `bun run build` y `bun run lint` pasan.
- [ ] No se ejecutaron tests ni migraciones sin autorización.
