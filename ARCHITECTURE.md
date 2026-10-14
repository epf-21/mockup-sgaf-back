# Arquitectura

Este backend usa **Clean Architecture** con una separación por capas:

- **dominio/**: reglas de negocio, tipos, errores y puertos.
- **aplicacion/**: casos de uso.
- **presentacion/**: controllers, DTOs, mappers y módulos Nest.
- **infraestructura/**: Prisma, base de datos y adaptadores externos.

## Organización

La estructura va por capa primero y luego por módulo:

```text
src/
  dominio/
    bienes/
    catalogos/
    personas/
    unidades/
  aplicacion/
    bienes/
    catalogos/
    personas/
    unidades/
  presentacion/
    bienes/
    catalogos/
    personas/
    unidades/
  infraestructura/
    bienes/
    catalogos/
    personas/
    unidades/
    base-datos/
    comun/
```

## Flujo

```text
HTTP -> Presentación -> Aplicación -> Dominio
                        -> Infraestructura
```

- **Presentación** recibe requests, valida DTOs y transforma datos.
- **Aplicación** coordina el caso de uso.
- **Dominio** define contratos y reglas.
- **Infraestructura** implementa acceso a datos y servicios concretos.

## Reglas

- La aplicación no depende de Prisma.
- El dominio no depende de NestJS.
- La infraestructura implementa puertos del dominio.
- Los módulos Nest viven en `presentacion/` y solo arman dependencias.

## Módulos actuales

- Bienes
- Catálogos
- Personas
- Unidades

