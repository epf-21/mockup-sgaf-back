# Análisis del esquema de base de datos (SGAF)

Análisis de `prisma/schema.prisma` frente a `docs/terminos.md` (TDR) y `docs/analisis.md`.
**Solo documento de análisis: no implica migraciones ni cambios de schema todavia.**

Referencias de línea apuntan a `prisma/schema.prisma`.

---

## 1. Resumen ejecutivo

El esquema es un buen mapeo 1:1 del **núcleo del negocio**: `bien`, `procesos`,
`movimientos`, inventario (`hojas_ruta`, `bienes_hoja_ruta`, `registros_inventario`,
`evidencias`), documentos (`documento`, `archivo`), catálogos (`codificador`,
`unidad_organizacional`, `ubicacion`) y `Persona`/`Usuario`.

Sin embargo, presenta **vacíos relevantes** respecto al TDR:

- **Sin subsistema financiero** (depreciación, gestión, revalúos, UFV): el módulo 5.4 es
  central y hoy no tiene tablas.
- **Sin auditoría ni seguridad**: no hay `log_auditoria`, sesiones, ni campos de
  credenciales/2FA en `Usuario` (módulo 5.1).
- **Sin correlativos NIA/NIM** ni control disponible/utilizado (analisis f).
- **Sin seguros** (analisis g), **sin alertas/notificaciones** (5.3/5.6), **sin evento de
  inventario** ni novedades no programadas (5.5).
- **Inconsistencias de modelado**: `bien.ubicacion` es texto libre en vez de FK,
  `bien.atributos` es `Text` (no filtrable), `numero` mezcla NIA y NIM, enums declarados
  y sin uso, timestamps de auditoría ausentes y sin índices en FKs.

Priorización al final (P1/P2/P3).

---

## 2. Tablas que faltan

| Requisito (TDR / analisis) | ¿Existe? | Tabla(s) faltante(s) |
| --- | --- | --- |
| 5.1 Autenticación, 2FA, SSO | ❌ | `log_auditoria`, `sesion` |
| 5.4 Cálculo financiero (cierre de gestión) | ❌ | `gestion`, `depreciacion`, `ajuste_valor`/`revaluo`, `ufv` |
| NIA/NIM (analisis f) | ❌ | `correlativo` / `rango_numeracion` |
| Seguros (analisis g) | ❌ | `aseguradora`, `tipo_seguro`, `poliza`, `bien_poliza` |
| 5.5 Eventos de inventario | Parcial | `evento_inventario` (gestión, nombre, alcance), `novedad`/`hallazgo` |
| 5.3 / 5.6 Alertas y notificaciones | ❌ | `notificacion`/`alerta` |
| 5.2 Centro de costo (objeto de gasto) | Reusado | Hoy se reutiliza `unidad_organizacional` vía `unidad_costo_id` |

### Detalle

- **`log_auditoria`** — pista de auditoría exigida por 5.1 y por las reglas de trazabilidad:
  `usuario_id`, `accion`, `entidad`, `entidad_id`, `fecha`, `ip`, `datos_antes`, `datos_despues`.
- **`sesion`** — gestión de sesiones y cierre por inactividad (5.1).
- **`gestion`** — año fiscal, estado (`abierta`/`cerrada`), fecha de cierre; soporta cierre,
  prorrateo e histórico inalterable (5.4).
- **`depreciacion`** — por `bien_id` y `gestion`: valor inicial, depreciación de la gestión,
  depreciación acumulada, valor neto, meses/días de prorrateo, método, flag `simulado`.
- **`ajuste_valor` / `revaluo`** — revalorizaciones e historial de actualizaciones (cuánto es
  costo original y cuánto ajuste por inflación) (5.4).
- **`ufv`** — fecha y valor UFV para el ajuste por inflación (5.4; suspendido desde dic-2020).
- **`correlativo`** — secuencia NIA (activos) y NIM (materiales), con estado
  `disponible`/`utilizado` y usuario al que fue transferido el rango (analisis f).
- **`aseguradora`, `tipo_seguro`, `poliza`, `bien_poliza`** — entidad, tipo, póliza y relación
  bien–póliza con vigencia (inicio/fin), monto asegurado y cobertura (analisis g).
- **`evento_inventario`** — agrupador de un inventario ("Inventario 2026"), con alcance por
  ubicación/tipo/centro de costo y estado (5.5).
- **`novedad` / `hallazgo`** — sobrantes, faltantes, bienes en mal estado o trasladados sin
  autorización, no programados (5.5).
- **`notificacion` / `alerta`** — recepción pendiente, vencimiento de salidas temporales,
  documentos vencidos y mantenimiento preventivo (5.3 / 5.6).

---

## 3. Campos faltantes por tabla

### `bien` (`schema.prisma:285`)
- **Financiero (5.4):** `valor_residual`, `depreciacion_acumulada`, `valor_neto`,
  `ajuste_inflacion`.
- **Ciclo de vida:** `fecha_baja`, `motivo_baja`.
- **Identificador preexistente (5.2):** `codigo_patrimonial` (carga de código patrimonial previo).
- **Auditoría:** `creado_en`, `actualizado_en` (hoy no tiene timestamps).

### `usuario` (`schema.prisma:203`)
- `password_hash` (encriptación de contraseñas, 5.1), `mfa_habilitado`/`mfa_secret` (2FA),
  `proveedor_id` (SSO / keycloak), `ultimo_acceso`, `intentos_fallidos`, `bloqueado_hasta`.

### `ubicacion` (`schema.prisma:250`)
- **`padre_id`** para la jerarquía Campus > Edificio > Piso > Ambiente (5.2). Hoy no existe
  relación de niveles.
- `activo` (soft-delete / baja lógica).

### `documento` (`schema.prisma:555`)
- `fecha_vencimiento` / `vigencia_hasta` (Reporte de Documentos Vencidos, 5.6).
- `subtipo` (factura, póliza, manual, garantía, acta, certificado); hoy `tipo` solo distingue
  la etapa del ciclo de vida (`adquisicion`/`operacion`/`asignacion`/`baja`).

### `movimientos` (`schema.prisma:399`)
- `estado` (usa el enum ya declarado `estado_movimiento`, hoy sin columna) y
  `fecha_movimiento`.

### `registros_inventario` (`schema.prisma:487`)
- `estado_conciliacion` (enum `estado_conciliacion` ya declarado y sin uso).

### `detalles_salida_temporal` (`schema.prisma:428`)
- Estado de devolución (pendiente / retornado / vencido); hoy solo fechas.

---

## 7. Trazabilidad requisito → brecha

| Requisito | Estado | Brecha principal |
| --- | --- | --- |
| 5.1 Auth / 2FA / SSO / sesiones / auditoría | ❌ | Campos en `usuario`; `log_auditoria`, `sesion` |
| 5.2 Registro y catalogación | ⚠️ Parcial | `ubicacion.padre_id`, `bien.ubicacion_id`, `atributos` filtrables, `codigo_patrimonial` |
| 5.2 Centro de costo (objeto de gasto) | ⚠️ Reusado | Catálogo propio vs `unidad_organizacional` |
| 5.3 Movimientos y traslados | ⚠️ Parcial | `movimientos.estado`/`fecha`, flujo de proceso, alertas |
| 5.4 Cálculo financiero | ❌ | `gestion`, `depreciacion`, `ajuste_valor`, `ufv`, campos en `bien` |
| 5.5 Inventario físico | ⚠️ Parcial | `evento_inventario`, `novedad`, `estado_conciliacion` |
| 5.6 Reportes y consultas | ⚠️ Parcial | Índices, `atributos`, `documento.fecha_vencimiento` |
| 5.7 Gestión documental | ⚠️ Parcial | `subtipo`, `fecha_vencimiento` |
| NIA/NIM | ❌ | `correlativo` con estado disponible/utilizado |
| Seguros | ❌ | `aseguradora`, `poliza`, `bien_poliza` |
| Trazabilidad inmutable | ⚠️ Parcial | `evento_bien`, timestamps de auditoría |
| Índices / escalabilidad | ❌ | Índices en FKs |

Leyenda: ✅ cubierto · ⚠️ parcial · ❌ ausente.

---

## 8. Priorización sugerida

### P1 — núcleo exigido por el TDR (bloquea módulos)
- Subsistema financiero: `gestion`, `depreciacion`, `ajuste_valor`/`revaluo`, `ufv` y campos
  financieros en `bien`.

### P3 — completitud funcional y calidad
- Seguros, notificaciones, `evento_inventario`/novedades, `ufv`, centro de costo propio.

---

## 9. Notas

- Este documento **no** modifica `prisma/schema.prisma` ni la base de datos.
- Toda propuesta queda sujeta a revisión funcional con el área de Activos Fijos antes de
  implementarse.
