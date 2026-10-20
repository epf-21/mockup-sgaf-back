# Integración con Prisma 7

Prisma vive únicamente en infraestructura. La aplicación define el port; el repositorio Prisma lo implementa y traduce datos.

## Configuración del proyecto

- Esquema: `prisma/schema.prisma`.
- Generador: `provider = "prisma-client"`, salida en `src/generated/prisma`.
- Configuración: `prisma7.config.ts`.
- Cliente generado: importar desde `src/generated/prisma/client`.
- Servicio: `PrismaService` en `src/infraestructura/base-datos/prisma.service.ts`.
- Adaptador: `PrismaPg` de `@prisma/adapter-pg`.
- `PrismaModule` es global y exporta `PrismaService`.

No edites `src/generated/prisma`; se regenera con `bunx prisma generate`.

## Flujo de una consulta

```text
UseCase -> Port (contrato) -> PrismaXRepository -> PrismaService -> PostgreSQL
```

Reglas:

- Las entradas del contrato usan tipos de dominio y las salidas usan `*.output.ts` de aplicación. Nunca tipos Prisma.
- El repositorio Prisma usa `select`/`include` explícitos.
- El repositorio Prisma traduce el resultado a los tipos de salida de aplicación.
- El caso de uso no sabe si hay Prisma debajo.

## Agregar un método de lectura

Contrato:

```ts
import type { ObtenerElementoOutput } from '../../aplicacion/elementos/use-cases/obtener-elemento/obtener-elemento.output';

export abstract class ElementoRepository {
  abstract obtenerDetalle(id: string): Promise<ObtenerElementoOutput | null>;
}
```

Implementación:

```ts
@Injectable()
export class PrismaElementoRepository implements ElementoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerDetalle(id: string): Promise<ObtenerElementoOutput | null> {
    const fila = await this.prisma.elemento.findUnique({
      where: { id },
      select: {
        id: true,
        codigo: true,
        descripcion: true,
        estado: true,
        unidad: { select: { id: true, nombre: true } },
        responsable: { select: { id: true, nombre_completo: true } },
      },
    });

    if (!fila) return null;

    return {
      id: fila.id,
      codigo: fila.codigo,
      descripcion: fila.descripcion,
      estado: fila.estado,
      unidad: fila.unidad,
      responsable: fila.responsable,
    };
  }
}
```

Reglas:

- `findUnique` devuelve `null`; no lances el error de “no encontrado” en infraestructura.
- Usa `select` para no cargar relaciones innecesarias.
- Si necesitas contar o paginar, usa `count` y `findMany` en paralelo.

## Agregar un método de escritura

```ts
async crear(datos: NuevoElemento): Promise<CrearElementoOutput> {
  const fila = await this.prisma.elemento.create({
    data: {
      codigo: datos.codigo,
      descripcion: datos.descripcion,
      estado: datos.estado,
      unidad_id: datos.unidadId,
      responsable_id: datos.responsableId,
    },
    select: {
      id: true,
      codigo: true,
      estado: true,
    },
  });

  return {
    id: fila.id,
    codigo: fila.codigo,
    estado: fila.estado,
  };
}
```

Reglas:

- Usa `create`, `createMany`, `update`, `updateMany`, `delete` según corresponda.
- Para escrituras compuestas, usa `$transaction`.
- No devuelvas la fila Prisma completa si la salida de aplicación espera un tipo más pequeño.
- No pongas reglas de negocio en el `data`; la entidad ya validó.

## Transacciones

### Transacción interactiva

Úsala cuando varias escrituras dependen del resultado anterior.

```ts
return this.prisma.$transaction(async (tx) => {
  const proceso = await tx.proceso.create({ data: datosProceso });
  await tx.movimiento.createMany({
    data: movimientos.map((movimiento) => ({
      proceso_id: proceso.id,
      bien_id: movimiento.bienId,
      estado: 'solicitud',
    })),
  });
  return this.aCrearProcesoOutput(proceso);
});
```

### Transacción por arreglo

Úsala cuando las operaciones son independientes.

```ts
const [proceso, movimientos] = await this.prisma.$transaction([
  this.prisma.proceso.create({ data: datosProceso }),
  this.prisma.movimiento.createMany({ data: movimientos }),
]);
```

Reglas:

- No hagas llamadas HTTP, correos o cálculos largos dentro de una transacción.
- Mantén la transacción corta para evitar bloqueos y timeouts.
- Si traduces errores de Prisma, hazlo después de la transacción, no dentro del callback si puedes evitarlo.
- No uses `$transaction` para una sola escritura.

## Traducción de errores de Prisma

Solo traduce errores esperados que representen reglas de negocio.

```ts
import { Prisma } from '../../generated/prisma/client';
import { CodigoDuplicadoError } from '../../dominio/elementos/errores/codigo-duplicado.error';

try {
  return await this.prisma.elemento.create({ data });
} catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    throw new CodigoDuplicadoError();
  }
  throw error;
}
```

Códigos frecuentes:

| Código | Significado | Acción típica |
| --- | --- | --- |
| `P2002` | Violación de unicidad | Error de dominio de duplicado |
| `P2025` | Registro no encontrado en update/delete | `NotFoundError` |
| `P2003` | Violación de clave foránea | Error de dominio o 400 |
| `P2000` | Valor demasiado largo | Error de validación de negocio |

No traduzcas todos los errores. Si no es una regla de negocio esperada, propaga el error para que los logs muestren la causa.

## Paginación

```ts
async listarPaginado(
  paginacion: Paginacion,
): Promise<ListarElementosOutput> {
  const skip = (paginacion.pagina - 1) * paginacion.porPagina;

  const [total, filas] = await Promise.all([
    this.prisma.elemento.count({ where: { activo: true } }),
    this.prisma.elemento.findMany({
      where: { activo: true },
      select: { id: true, codigo: true, descripcion: true },
      orderBy: { codigo: 'asc' },
      skip,
      take: paginacion.porPagina,
    }),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(total / paginacion.porPagina));

  return {
    datos: filas.map((fila) => this.aResumen(fila)),
    total,
    pagina: paginacion.pagina,
    por_pagina: paginacion.porPagina,
    total_paginas: totalPaginas,
    siguiente:
      paginacion.pagina < totalPaginas ? paginacion.pagina + 1 : null,
    anterior:
      paginacion.pagina > 1
        ? Math.min(paginacion.pagina - 1, totalPaginas)
        : null,
  };
}
```

Reglas:

- Ordena siempre para que la paginación sea estable.
- `skip`/`take` con `page`/`pageSize` es suficiente para este proyecto.
- No calcules `total` con `findMany().length`.

## Relaciones y N+1

- Usa `include` si necesitas la relación completa y sus campos son pocos.
- Usa `select` anidado para elegir solo los campos necesarios.
- No hagas una consulta por cada fila en un bucle; usa `include`, `in` o una consulta adicional agrupada.
- Si una relación es opcional, el tipo generado puede ser `null`; refléjalo en el tipo de dominio.

## Tipos y valores especiales

- `Decimal`: Prisma devuelve `Decimal`; conviértelo a `number` o `string` según el contrato de dominio. Convierte en el repositorio, no en el caso de uso.
- `Date`: Prisma devuelve `Date`; el JSON lo serializa como ISO. Si el dominio usa `string` `YYYY-MM-DD`, convierte en el repositorio.
- Enums: los enums de Prisma y de dominio pueden tener los mismos valores, pero no son el mismo tipo. Mapea explícitamente.
- `null` vs `undefined`: en Prisma, `undefined` significa “no tocar” en un update; `null` significa “poner null”. Sé explícito.

## Consultas raw

Evítalas salvo que la consulta no se pueda expresar con el cliente.

```ts
const filas = await this.prisma.$queryRaw<Fila[]>`
  SELECT id, codigo
  FROM elemento
  WHERE activo = true
`;
```

Reglas:

- Nunca interpoles strings de usuario directamente; usa `Prisma.sql` o parámetros.
- Prefiere `$queryRaw` con template literal etiquetado.
- Documenta por qué la consulta no se puede hacer con el cliente.
- No devuelvas tipos Prisma crudos a dominio.

## Migraciones y seeds

- No crees ni apliques migraciones sin autorización explícita.
- No ejecutes `bun run db:seed` sin autorización; actualiza datos demo.
- No uses `prisma migrate reset` ni `db push --force-reset`.
- Si el usuario pide una migración, consulta la skill `prisma-cli` y confirma el flujo.
- Después de cambiar el esquema, `bunx prisma generate` actualiza el cliente; no edites el cliente generado.

## Errores comunes

| Síntoma | Causa | Solución |
| --- | --- | --- |
| `Property 'x' does not exist` | Cliente generado desactualizado | `bunx prisma generate` |
| `PrismaClientInitializationError` | `DATABASE_URL` o base caída | Revisa `.env` y `docker compose ps` |
| `Null constraint violation` | Campo requerido con `null`/`undefined` | Revisa el `data` y el esquema |
| `Unique constraint failed` | `P2002` no traducido | Traduce a error de dominio |
| `Unknown argument` | Esquema/cliente desalineado | Regenera el cliente |
| Transacción colgada | Operación lenta dentro de `$transaction` | Saca llamadas externas del callback |

## Checklist Prisma

- [ ] El port está en `aplicacion/<modulo>/ports/`; usa tipos de dominio para entradas y `*.output.ts` para salidas.
- [ ] La implementación está en infraestructura y tiene `@Injectable()`.
- [ ] Usa `select`/`include` explícitos.
- [ ] Traduce modelos Prisma a los tipos de salida (`*.output.ts`).
- [ ] Usa `$transaction` solo cuando hay múltiples escrituras dependientes.
- [ ] Traduce errores esperados a errores de dominio.
- [ ] No edita `src/generated/prisma`.
- [ ] No ejecuta migraciones ni seeds sin autorización.
