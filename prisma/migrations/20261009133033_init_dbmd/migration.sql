-- CreateEnum
CREATE TYPE "tipo_unidad" AS ENUM ('rectorado', 'vicerrectorado', 'facultad', 'departamento', 'direccion', 'programa', 'otro');

-- CreateEnum
CREATE TYPE "tipo_ubicacion" AS ENUM ('campus', 'edificio', 'piso', 'ambiente');

-- CreateEnum
CREATE TYPE "tipo_documento_adq" AS ENUM ('factura', 'acta_donacion', 'contrato', 'convenio', 'sin_documento');

-- CreateEnum
CREATE TYPE "origen_tipo" AS ENUM ('propio', 'alquiler', 'comodato', 'convenio', 'prestamo_recibido');

-- CreateEnum
CREATE TYPE "clase_bien" AS ENUM ('activo', 'material');

-- CreateEnum
CREATE TYPE "naturaleza_bien" AS ENUM ('tangible', 'intangible');

-- CreateEnum
CREATE TYPE "metodo_depreciacion" AS ENUM ('lineal', 'saldo_decreciente');

-- CreateEnum
CREATE TYPE "tipo_dato" AS ENUM ('string', 'number', 'date', 'boolean');

-- CreateEnum
CREATE TYPE "estado_bien" AS ENUM ('en_registro', 'activo', 'fuera_de_servicio', 'en_prestamo', 'baja');

-- CreateEnum
CREATE TYPE "estado_fisico" AS ENUM ('excelente', 'muy_bueno', 'bueno', 'regular', 'malo');

-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('inventariador', 'supervisor', 'tecnico_contable', 'administrador', 'custodio', 'director');

-- CreateEnum
CREATE TYPE "categoria_proceso" AS ENUM ('alta', 'baja', 'movimiento', 'custodia', 'mantenimiento', 'regularizacion', 'prestamo');

-- CreateEnum
CREATE TYPE "estado_tarea" AS ENUM ('asignada', 'en_ejecucion', 'pausada', 'cerrada', 'cancelada');

-- CreateEnum
CREATE TYPE "tipo_proceso_enum" AS ENUM ('asignacion', 'traspaso', 'transferencia', 'devolucion', 'salida');

-- CreateEnum
CREATE TYPE "etapa_proceso" AS ENUM ('solicitud', 'autizacion', 'ejecucion', 'aceptacion', 'cierre', 'anulacion', 'rechazo');

-- CreateEnum
CREATE TYPE "estado_movimiento" AS ENUM ('solicitud', 'autorizado', 'ejecucion', 'aceptacion');

-- CreateEnum
CREATE TYPE "estado_proceso" AS ENUM ('pendiente', 'procesado', 'cerrado');

-- CreateEnum
CREATE TYPE "estado_hoja_ruta" AS ENUM ('pendiente', 'asiganda', 'en_ejecucion', 'pendiente_revision', 'en_revision', 'pendiente_reverificacion', 'conciliada', 'cerrada', 'cancelada');

-- CreateEnum
CREATE TYPE "resultado_inspeccion" AS ENUM ('localizado', 'no_localizado', 'sobrante', 'requiere_reverificacion');

-- CreateEnum
CREATE TYPE "estado_fisico_inventario" AS ENUM ('excelente', 'muy_bueno', 'bueno', 'malo', 'regular', 'chatarra');

-- CreateEnum
CREATE TYPE "estado_conciliacion" AS ENUM ('pendiente', 'en_revision', 'aprobado', 'rechazado', 'requiere_reverificacion');

-- CreateEnum
CREATE TYPE "tipo_documento" AS ENUM ('adquisicion', 'operacion', 'asignacion', 'baja');

-- CreateTable
CREATE TABLE "persona" (
    "id" TEXT NOT NULL,
    "documento_identidad" VARCHAR NOT NULL,
    "nombre_completo" VARCHAR NOT NULL,
    "email" VARCHAR,
    "telefono" VARCHAR,

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "persona_id" TEXT,
    "email" VARCHAR NOT NULL,
    "rol" "rol_usuario" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidad_organizacional" (
    "id" TEXT NOT NULL,
    "padre_id" TEXT,
    "codigo" VARCHAR NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "tipo" "tipo_unidad" NOT NULL,
    "responsable_id" TEXT NOT NULL,

    CONSTRAINT "unidad_organizacional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ubicacion" (
    "id" TEXT NOT NULL,
    "codigo" VARCHAR,
    "nombre" VARCHAR NOT NULL,
    "tipo" "tipo_ubicacion" NOT NULL,
    "unidad_id" TEXT,
    "latitud" DECIMAL,
    "longitud" DECIMAL,

    CONSTRAINT "ubicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codificador" (
    "id" TEXT NOT NULL,
    "codigo" VARCHAR NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "clase" "clase_bien" NOT NULL,
    "naturaleza" "naturaleza_bien" NOT NULL,
    "depreciable" BOOLEAN NOT NULL DEFAULT false,
    "tasa_depreciacion" DECIMAL,
    "vida_util_meses" INTEGER,
    "metodo_depreciacion" "metodo_depreciacion",
    "cuenta_contable" VARCHAR,

    CONSTRAINT "codificador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bien" (
    "id" TEXT NOT NULL,
    "codificador_id" TEXT NOT NULL,
    "padre_id" TEXT,
    "numero" INTEGER NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "unidad_id" TEXT NOT NULL,
    "responsable_id" TEXT NOT NULL,
    "patrimonial" BOOLEAN NOT NULL DEFAULT false,
    "valor_original" DECIMAL,
    "estado" "estado_bien" NOT NULL DEFAULT 'en_registro',
    "estado_fisico_inicial" "estado_fisico",
    "estado_fisico" "estado_fisico",
    "unidad_costo_id" TEXT NOT NULL,
    "fecha_alta" DATE NOT NULL,
    "adquisicion_tipo_documento" "tipo_documento_adq" NOT NULL,
    "adquisicion_nro_documento" VARCHAR,
    "fecha_adquisicion" DATE NOT NULL,
    "origen_nombre" VARCHAR,
    "origen_tipo" "origen_tipo",

    CONSTRAINT "bien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarea" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "estado" "estado_tarea" NOT NULL,
    "categoria" "categoria_proceso" NOT NULL,
    "creado_por_id" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_finalizacion" TIMESTAMPTZ(3),
    "deriva_en_procesos" BOOLEAN,
    "gestion" INTEGER NOT NULL,

    CONSTRAINT "tarea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarea_supervisor" (
    "id" TEXT NOT NULL,
    "tarea_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "fecha_asignacion" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rol" VARCHAR(20),

    CONSTRAINT "tarea_supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_proceso" (
    "id" TEXT NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "categoria" "categoria_proceso" NOT NULL,
    "requiere_autorizacion" BOOLEAN NOT NULL DEFAULT false,
    "requiere_ejecucion_campo" BOOLEAN NOT NULL DEFAULT false,
    "requiere_aceptacion_custodia" BOOLEAN NOT NULL DEFAULT false,
    "genera_formulario" BOOLEAN NOT NULL DEFAULT true,
    "genera_movimiento" BOOLEAN NOT NULL DEFAULT true,
    "afecta_patrimonio" BOOLEAN NOT NULL DEFAULT false,
    "afecta_depreciacion" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tipo_proceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procesos" (
    "id" TEXT NOT NULL,
    "tarea_id" TEXT NOT NULL,
    "estado" "estado_proceso" NOT NULL,
    "codigo" VARCHAR(30),
    "tipo_proceso_id" TEXT NOT NULL,
    "autorizado_por_id" TEXT,
    "fecha_autorizacion" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "cerrado_por" TEXT,
    "fecha_cierre" TIMESTAMPTZ(3),
    "descripcion" TEXT,
    "observaciones" TEXT,

    CONSTRAINT "procesos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos" (
    "id" TEXT NOT NULL,
    "proceso_id" TEXT NOT NULL,
    "bien_id" TEXT NOT NULL,
    "unidad_origen_id" TEXT,
    "ubicacion_origen_id" TEXT,
    "responsable_origen_id" TEXT,
    "unidad_destino_id" TEXT,
    "ubicacion_destino_id" TEXT,
    "responsable_destino_id" TEXT,
    "motivo" TEXT,
    "observaciones" TEXT,

    CONSTRAINT "movimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_salida_temporal" (
    "movimiento_id" TEXT NOT NULL,
    "fecha_solicitud" TIMESTAMPTZ(3),
    "fecha_efectiva" TIMESTAMPTZ(3),
    "fecha_devolucion" TIMESTAMPTZ(3),

    CONSTRAINT "detalles_salida_temporal_pkey" PRIMARY KEY ("movimiento_id")
);

-- CreateTable
CREATE TABLE "hojas_ruta" (
    "id" TEXT NOT NULL,
    "tarea_id" TEXT NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "unidad_id" TEXT,
    "ubicacion_id" TEXT,
    "unidad_costo_id" TEXT,
    "estado" "estado_hoja_ruta" NOT NULL,
    "fecha_inicio" TIMESTAMPTZ(3),
    "fecha_envio_revision" TIMESTAMPTZ(3),
    "fecha_conciliacion" TIMESTAMPTZ(3),
    "fecha_cierre" TIMESTAMPTZ(3),
    "asignado_a_id" TEXT,
    "supervisor_id" TEXT,
    "observaciones" TEXT,
    "creado_en" TIMESTAMPTZ(3),
    "actualizado_en" TIMESTAMPTZ(3),

    CONSTRAINT "hojas_ruta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bienes_hoja_ruta" (
    "id" TEXT NOT NULL,
    "hoja_ruta_id" TEXT NOT NULL,
    "bien_id" TEXT NOT NULL,
    "estado" VARCHAR(30) NOT NULL,
    "agregado_en" TIMESTAMPTZ(3),
    "observaciones" TEXT,

    CONSTRAINT "bienes_hoja_ruta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_inventario" (
    "id" TEXT NOT NULL,
    "hoja_ruta_id" TEXT NOT NULL,
    "bien_hoja_ruta_id" TEXT,
    "bien_id" TEXT,
    "codigo_leido" VARCHAR(100),
    "resultado" "resultado_inspeccion" NOT NULL,
    "estado_fisico_observado" "estado_fisico_inventario",
    "unidad_observada_id" TEXT,
    "ubicacion_observada_id" TEXT,
    "responsable_observado_id" TEXT,
    "latitud" DECIMAL(10,7),
    "longitud" DECIMAL(10,7),
    "inventariador_id" TEXT NOT NULL,
    "fecha_inspeccion" TIMESTAMPTZ(3) NOT NULL,
    "observaciones" TEXT,
    "supervisor_id" TEXT,
    "fecha_revision" TIMESTAMPTZ(3),
    "comentario_revision" TEXT,
    "creado_en" TIMESTAMPTZ(3),
    "actualizado_en" TIMESTAMPTZ(3),

    CONSTRAINT "registros_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidencias" (
    "id" TEXT NOT NULL,
    "registro_inventario_id" TEXT NOT NULL,
    "nombre_archivo" VARCHAR(255),
    "ruta" VARCHAR(500) NOT NULL,
    "fecha_captura" TIMESTAMPTZ(3),
    "cargado_por_id" TEXT,
    "creado_en" TIMESTAMPTZ(3),

    CONSTRAINT "evidencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivo" (
    "id" TEXT NOT NULL,
    "nombre_original" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "tamano_bytes" BIGINT NOT NULL,
    "ruta_almacenamiento" VARCHAR(500) NOT NULL,
    "hash_sha256" VARCHAR(64) NOT NULL,
    "subido_por" TEXT NOT NULL,
    "subido_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documento" (
    "id" TEXT NOT NULL,
    "archivo_id" TEXT NOT NULL,
    "tipo" "tipo_documento" NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "bien_id" TEXT,
    "proceso_id" TEXT,
    "tarea_id" TEXT,
    "registro_inventario_id" TEXT,
    "nro_documento" VARCHAR(100),
    "fecha_documento" DATE,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "subido_por" TEXT NOT NULL,
    "subido_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "persona_documento_identidad_key" ON "persona"("documento_identidad");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_persona_id_key" ON "usuario"("persona_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unidad_organizacional_codigo_key" ON "unidad_organizacional"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ubicacion_codigo_key" ON "ubicacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "codificador_codigo_key" ON "codificador"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "bien_numero_key" ON "bien"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_proceso_codigo_key" ON "tipo_proceso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "archivo_hash_sha256_key" ON "archivo"("hash_sha256");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidad_organizacional" ADD CONSTRAINT "unidad_organizacional_padre_id_fkey" FOREIGN KEY ("padre_id") REFERENCES "unidad_organizacional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidad_organizacional" ADD CONSTRAINT "unidad_organizacional_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ubicacion" ADD CONSTRAINT "ubicacion_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "unidad_organizacional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bien" ADD CONSTRAINT "bien_codificador_id_fkey" FOREIGN KEY ("codificador_id") REFERENCES "codificador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bien" ADD CONSTRAINT "bien_padre_id_fkey" FOREIGN KEY ("padre_id") REFERENCES "bien"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bien" ADD CONSTRAINT "bien_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "unidad_organizacional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bien" ADD CONSTRAINT "bien_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bien" ADD CONSTRAINT "bien_unidad_costo_id_fkey" FOREIGN KEY ("unidad_costo_id") REFERENCES "unidad_organizacional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarea" ADD CONSTRAINT "tarea_creado_por_id_fkey" FOREIGN KEY ("creado_por_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarea_supervisor" ADD CONSTRAINT "tarea_supervisor_tarea_id_fkey" FOREIGN KEY ("tarea_id") REFERENCES "tarea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarea_supervisor" ADD CONSTRAINT "tarea_supervisor_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_tarea_id_fkey" FOREIGN KEY ("tarea_id") REFERENCES "tarea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_tipo_proceso_id_fkey" FOREIGN KEY ("tipo_proceso_id") REFERENCES "tipo_proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_autorizado_por_id_fkey" FOREIGN KEY ("autorizado_por_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_cerrado_por_fkey" FOREIGN KEY ("cerrado_por") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_proceso_id_fkey" FOREIGN KEY ("proceso_id") REFERENCES "procesos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "bien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_unidad_origen_id_fkey" FOREIGN KEY ("unidad_origen_id") REFERENCES "unidad_organizacional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_ubicacion_origen_id_fkey" FOREIGN KEY ("ubicacion_origen_id") REFERENCES "ubicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_responsable_origen_id_fkey" FOREIGN KEY ("responsable_origen_id") REFERENCES "persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_unidad_destino_id_fkey" FOREIGN KEY ("unidad_destino_id") REFERENCES "unidad_organizacional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_ubicacion_destino_id_fkey" FOREIGN KEY ("ubicacion_destino_id") REFERENCES "ubicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_responsable_destino_id_fkey" FOREIGN KEY ("responsable_destino_id") REFERENCES "persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_salida_temporal" ADD CONSTRAINT "detalles_salida_temporal_movimiento_id_fkey" FOREIGN KEY ("movimiento_id") REFERENCES "movimientos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_ruta" ADD CONSTRAINT "hojas_ruta_tarea_id_fkey" FOREIGN KEY ("tarea_id") REFERENCES "tarea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_ruta" ADD CONSTRAINT "hojas_ruta_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "unidad_organizacional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_ruta" ADD CONSTRAINT "hojas_ruta_ubicacion_id_fkey" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_ruta" ADD CONSTRAINT "hojas_ruta_unidad_costo_id_fkey" FOREIGN KEY ("unidad_costo_id") REFERENCES "unidad_organizacional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_ruta" ADD CONSTRAINT "hojas_ruta_asignado_a_id_fkey" FOREIGN KEY ("asignado_a_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_ruta" ADD CONSTRAINT "hojas_ruta_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bienes_hoja_ruta" ADD CONSTRAINT "bienes_hoja_ruta_hoja_ruta_id_fkey" FOREIGN KEY ("hoja_ruta_id") REFERENCES "hojas_ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bienes_hoja_ruta" ADD CONSTRAINT "bienes_hoja_ruta_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "bien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_inventario" ADD CONSTRAINT "registros_inventario_hoja_ruta_id_fkey" FOREIGN KEY ("hoja_ruta_id") REFERENCES "hojas_ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_inventario" ADD CONSTRAINT "registros_inventario_bien_hoja_ruta_id_fkey" FOREIGN KEY ("bien_hoja_ruta_id") REFERENCES "bienes_hoja_ruta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_inventario" ADD CONSTRAINT "registros_inventario_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "bien"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_inventario" ADD CONSTRAINT "registros_inventario_unidad_observada_id_fkey" FOREIGN KEY ("unidad_observada_id") REFERENCES "unidad_organizacional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_inventario" ADD CONSTRAINT "registros_inventario_ubicacion_observada_id_fkey" FOREIGN KEY ("ubicacion_observada_id") REFERENCES "ubicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_inventario" ADD CONSTRAINT "registros_inventario_responsable_observado_id_fkey" FOREIGN KEY ("responsable_observado_id") REFERENCES "persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_inventario" ADD CONSTRAINT "registros_inventario_inventariador_id_fkey" FOREIGN KEY ("inventariador_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_inventario" ADD CONSTRAINT "registros_inventario_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_registro_inventario_id_fkey" FOREIGN KEY ("registro_inventario_id") REFERENCES "registros_inventario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_cargado_por_id_fkey" FOREIGN KEY ("cargado_por_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivo" ADD CONSTRAINT "archivo_subido_por_fkey" FOREIGN KEY ("subido_por") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "archivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "bien"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_proceso_id_fkey" FOREIGN KEY ("proceso_id") REFERENCES "procesos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_tarea_id_fkey" FOREIGN KEY ("tarea_id") REFERENCES "tarea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_registro_inventario_id_fkey" FOREIGN KEY ("registro_inventario_id") REFERENCES "registros_inventario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_subido_por_fkey" FOREIGN KEY ("subido_por") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
