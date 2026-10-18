UPDATE "procesos"
SET "codigo" = 'PROC-LEGACY-' || substr("id", 1, 16)
WHERE "codigo" IS NULL;

ALTER TABLE "procesos" ALTER COLUMN "codigo" SET NOT NULL;

CREATE UNIQUE INDEX "procesos_codigo_key" ON "procesos"("codigo");

INSERT INTO "tipo_proceso" (
    "id",
    "codigo",
    "nombre",
    "categoria",
    "requiere_autorizacion",
    "requiere_ejecucion_campo",
    "requiere_aceptacion_custodia",
    "genera_formulario",
    "genera_movimiento",
    "afecta_patrimonio",
    "afecta_depreciacion"
) VALUES
    (gen_random_uuid(), 'ACTUALIZACION', 'ACTUALIZACION', 'regularizacion', true, false, false, true, false, true, true),
    (gen_random_uuid(), 'AJUSTE', 'AJUSTE', 'regularizacion', true, false, false, true, false, true, true),
    (gen_random_uuid(), 'BAJA_ACTIVOS', 'BAJA ACTIVOS', 'baja', true, false, false, true, false, true, true),
    (gen_random_uuid(), 'BAJA_ACTIVOS_FALTANTES', 'BAJA ACTIVOS FALTANTES', 'baja', true, false, false, true, false, true, true),
    (gen_random_uuid(), 'BAJA_MATERIALES', 'BAJA MATERIALES', 'baja', true, false, false, true, false, true, true),
    (gen_random_uuid(), 'BAJA_MATERIALES_FALTANTES', 'BAJA MATERIALES FALTANTES', 'baja', true, false, false, true, false, true, true),
    (gen_random_uuid(), 'CAMBIO_RESPONSABLE', 'CAMBIO DE RESPONSABLE', 'movimiento', true, true, true, true, true, false, false),
    (gen_random_uuid(), 'CAMBIO_RESP_NO_PATRIM', 'CAMBIO DE RESPONSABLE NO PATRIMONIALES', 'movimiento', true, true, true, true, true, false, false),
    (gen_random_uuid(), 'COMPRA_BIENES_MATERIALES', 'COMPRA DE BIENES Y/O MATERIALES', 'alta', false, false, false, true, false, true, true),
    (gen_random_uuid(), 'DONACION_PROYECTOS_EXTERNOS', 'DONACION DE PROYECTOS (EXTERNOS)', 'alta', false, false, false, true, false, true, true),
    (gen_random_uuid(), 'DONACION_INSTITUCION', 'DONACION INSTITUCION', 'alta', false, false, false, true, false, true, true),
    (gen_random_uuid(), 'DONACION_TERCEROS', 'DONACION TERCEROS', 'alta', false, false, false, true, false, true, true),
    (gen_random_uuid(), 'FALTANTES', 'FALTANTES', 'regularizacion', true, true, false, true, false, true, true),
    (gen_random_uuid(), 'MANTENIMIENTO', 'MANTENIMIENTO', 'mantenimiento', true, false, false, true, true, false, false),
    (gen_random_uuid(), 'PRESTAMO_DENTRO_INSTITUCION', 'PRESTAMO DENTRO LA INSTITUCION', 'prestamo', true, false, true, true, true, false, false),
    (gen_random_uuid(), 'PRESTAMO_FUERA_INSTITUCION', 'PRESTAMO FUERA LA INSTITUCION', 'prestamo', true, false, true, true, true, false, false),
    (gen_random_uuid(), 'CUSTODIA_ALQUILER', 'REGISTRO BIENES EN CUSTODIA ALQUILER', 'custodia', true, false, true, true, true, false, false),
    (gen_random_uuid(), 'CUSTODIA_COMODATO', 'REGISTRO BIENES EN CUSTODIA COMODATO', 'custodia', true, false, true, true, true, false, false),
    (gen_random_uuid(), 'CUSTODIA_CONVENIO', 'REGISTRO BIENES EN CUSTODIA CONVENIO', 'custodia', true, false, true, true, true, false, false),
    (gen_random_uuid(), 'CUSTODIA_PRESTAMO', 'REGISTRO BIENES EN CUSTODIA PRESTAMO', 'custodia', true, false, true, true, true, false, false),
    (gen_random_uuid(), 'CUSTODIA_RENTA', 'REGISTRO BIENES EN CUSTODIA RENTA', 'custodia', true, false, true, true, true, false, false),
    (gen_random_uuid(), 'REINCORPORACION', 'REINCORPORACION', 'regularizacion', true, true, false, true, false, true, true),
    (gen_random_uuid(), 'REPOSICION', 'REPOSICION', 'alta', false, false, false, true, false, true, true),
    (gen_random_uuid(), 'TRANSFERENCIA', 'TRANSFERENCIA', 'movimiento', true, true, true, true, true, false, false),
    (gen_random_uuid(), 'TRANSFERENCIA_NO_PATRIMONIALES', 'TRANSFERENCIA NO PATRIMONIALES', 'movimiento', true, true, true, true, true, false, false),
    (gen_random_uuid(), 'TRASPASO_CUSTODIA', 'TRASPASO BIENES EN CUSTODIA', 'custodia', true, true, true, true, true, false, false)
ON CONFLICT ("codigo") DO NOTHING;
