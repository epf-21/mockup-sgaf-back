# Módulos e inyección de dependencias

El módulo Nest es el composition root del proyecto. Aquí se decide qué implementación concreta satisface cada port de aplicación y cómo se construyen los casos de uso.

## Plantilla de módulo

```ts
import { Module } from '@nestjs/common';
import { BienRepository } from '../../aplicacion/bienes/ports/bien.repository';
import { ReferenciasBienRepository } from '../../aplicacion/bienes/ports/referencias-bien.repository';
import { CrearBienInputBoundary } from '../../aplicacion/bienes/use-cases/crear-bien/crear-bien.input-boundary';
import { CrearBienUseCase } from '../../aplicacion/bienes/use-cases/crear-bien/crear-bien.use-case';
import { PrismaBienRepository } from '../../infraestructura/bienes/prisma-bien.repository';
import { PrismaReferenciasBienRepository } from '../../infraestructura/bienes/prisma-referencias-bien.repository';
import { BienesController } from './bienes.controller';

@Module({
  controllers: [BienesController],
  providers: [
    {
      provide: BienRepository,
      useClass: PrismaBienRepository,
    },
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

## Los tres patrones de provider

### 1. `useClass` para adaptadores

Se usa cuando la implementación es una clase inyectable de NestJS, normalmente un repositorio Prisma o un adaptador de infraestructura.

```ts
{
  provide: BienRepository,
  useClass: PrismaBienRepository,
}
```

`PrismaBienRepository` lleva `@Injectable()` y recibe `PrismaService` por constructor. Nest crea la instancia y la asocia al token `BienRepository`.

### 2. `useFactory` para casos de uso

Los casos de uso son clases planas, sin `@Injectable()`. Por eso se construyen a mano:

```ts
{
  provide: CrearBienInputBoundary,
  useFactory: (bienes: BienRepository, referencias: ReferenciasBienRepository) =>
    new CrearBienUseCase(bienes, referencias),
  inject: [BienRepository, ReferenciasBienRepository],
}
```

Reglas:

- El orden de `inject` debe coincidir con el orden de los parámetros de la factory.
- El token es el `InputBoundary`, no la clase `UseCase`.
- Si el caso de uso cambia su constructor, actualiza la factory y `inject` en el mismo edit.
- No uses `useClass` con un caso de uso que no tiene decorador; Nest intentaría resolver sus parámetros por metadatos y fallaría.

### 3. `useValue` para configuración u objetos

No es común en este proyecto, pero es válido para constantes u opciones:

```ts
{
  provide: 'OPCIONES',
  useValue: { limite: 100 },
}
```

Prefiere tokens de clase abstracta para ports y boundaries y evita strings mágicos.

## Tokens: clases abstractas

El token es la clase abstracta de aplicación.

```ts
import type { ObtenerDetalleBienOutput } from '../../aplicacion/bienes/use-cases/obtener-detalle-bien/obtener-detalle-bien.output';

export abstract class BienRepository {
  abstract obtenerDetalle(id: string): Promise<ObtenerDetalleBienOutput | null>;
}
```

El controller inyecta el token:

```ts
constructor(
  @Inject(BienRepository)
  private readonly bienes: BienRepository,
) {}
```

No inyectes `PrismaBienRepository` ni `CrearBienUseCase` en el controller: eso acopla la presentación a la implementación y rompe la inversión de dependencias.

## Orden recomendado para escribir un módulo

1. Define ports y boundaries de aplicación (clases abstractas).
2. Implementa repositorios Prisma con `@Injectable()`.
3. Implementa casos de uso como clases planas.
4. Crea el controller con `@Inject(Boundary)`.
5. Declara `controllers` y `providers` en el módulo.
6. Si el módulo es nuevo, agrégalo a `imports` en `src/app.module.ts`.
7. Compila.

## Módulos globales existentes

- `PrismaModule` es `@Global()` y exporta `PrismaService`. No necesitas importarlo en cada módulo.
- `ConfigModule.forRoot({ isGlobal: true })` está en `AppModule`; `process.env` está disponible, pero prefiere inyectar configuración si la lógica se vuelve compleja.

## Ejemplo con varios casos de uso

```ts
@Module({
  controllers: [TareasController],
  providers: [
    { provide: Reloj, useClass: RelojSistema },
    { provide: TareaRepository, useClass: PrismaTareaRepository },
    {
      provide: ReferenciasTareaRepository,
      useClass: PrismaReferenciasTareaRepository,
    },
    {
      provide: CrearTareaInputBoundary,
      useFactory: (
        tareas: TareaRepository,
        referencias: ReferenciasTareaRepository,
      ) => new CrearTareaUseCase(tareas, referencias),
      inject: [TareaRepository, ReferenciasTareaRepository],
    },
    {
      provide: ListarTareasInputBoundary,
      useFactory: (tareas: TareaRepository) => new ListarTareasUseCase(tareas),
      inject: [TareaRepository],
    },
    {
      provide: CerrarTareaInputBoundary,
      useFactory: (
        tareas: TareaRepository,
        referencias: ReferenciasTareaRepository,
        reloj: Reloj,
      ) => new CerrarTareaUseCase(tareas, referencias, reloj),
      inject: [TareaRepository, ReferenciasTareaRepository, Reloj],
    },
  ],
})
export class TareasModule {}
```

## Casos especiales

### Dependencia circular

Si dos módulos o providers se necesitan mutuamente, primero intenta invertir la dependencia o extraer un tercer contrato. `forwardRef` es el último recurso:

```ts
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => OtroModule)],
})
export class MiModule {}
```

### Providers con alcance

Por defecto todos los providers son singleton. No uses `scope: Scope.REQUEST` salvo que realmente necesites datos por request; complica el rendimiento y la inyección en casos de uso.

### Configuración opcional

Si un provider puede no existir, usa `@Optional()` en el consumidor. Evítalo si puedes garantizar el provider en el módulo.

### Dependencias externas

Si agregas una librería nueva, primero verifica que ya esté en `package.json`. No inventes imports que el proyecto no tenga instalados.

## Errores comunes de DI

| Error | Causa probable | Solución |
| --- | --- | --- |
| `Nest can't resolve dependencies of ...` | Falta un provider o no está exportado/importado | Declara el provider en el módulo o importa el módulo que lo exporta |
| `Cannot read properties of undefined` en un caso de uso | `inject` no coincide con la factory | Revisa orden y tokens |
| El controller recibe `undefined` | Falta `@Inject(Token)` | Agrega el decorador con la clase abstracta |
| `Nest can't resolve dependencies of the XController` | El boundary no está en `providers` | Agrega el provider del boundary |
| `A circular dependency has been detected` | Módulos/providers se referencian entre sí | Invierte la dependencia o usa `forwardRef` |
| El repositorio Prisma no se instancia | Falta `@Injectable()` | Agrega el decorador |

## Checklist de DI

- [ ] Cada port y boundary tiene un token de clase abstracta.
- [ ] Cada implementación Prisma tiene `@Injectable()`.
- [ ] Cada caso de uso está construido con `useFactory`.
- [ ] `inject` coincide con los parámetros de la factory.
- [ ] El controller usa `@Inject(Boundary)`.
- [ ] El módulo declara todos los controllers y providers.
- [ ] El módulo nuevo está en `AppModule`.
