/*
  Warnings:

  - The values [asiganda] on the enum `estado_hoja_ruta` will be removed. If these variants are still used in the database, this will fail.
  - The values [tecnico_contable] on the enum `rol_usuario` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `ubicacion` on the `bien` table. All the data in the column will be lost.
  - You are about to drop the column `metodo_depreciacion` on the `codificador` table. All the data in the column will be lost.
  - You are about to drop the column `cerrado_por` on the `procesos` table. All the data in the column will be lost.
  - You are about to drop the column `deriva_en_procesos` on the `tarea` table. All the data in the column will be lost.
  - You are about to drop the `tarea_supervisor` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `estado` on the `bienes_hoja_ruta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "estado_bien_hoja_ruta" AS ENUM ('pendiente', 'localizado', 'no_localizado', 'sobrante', 'requiere_reverificacion');

-- CreateEnum
CREATE TYPE "estado_gestion" AS ENUM ('abierta', 'cerrada');

-- CreateEnum
CREATE TYPE "tipo_ajuste" AS ENUM ('revaluo', 'ajuste_inflacion');

-- CreateEnum
CREATE TYPE "estado_evento_inventario" AS ENUM ('planificado', 'en_ejecucion', 'conciliacion', 'cerrado', 'cancelado');

-- CreateEnum
CREATE TYPE "tipo_novedad" AS ENUM ('sobrante', 'faltante', 'mal_estado', 'traslado_sin_autorizar', 'etiqueta_danada', 'otro');

-- CreateEnum
CREATE TYPE "estado_novedad" AS ENUM ('registrada', 'en_revision', 'resuelta', 'rechazada');

-- AlterEnum
BEGIN;
CREATE TYPE "estado_hoja_ruta_new" AS ENUM ('pendiente', 'asignada', 'en_ejecucion', 'pendiente_revision', 'en_revision', 'pendiente_reverificacion', 'conciliada', 'cerrada', 'cancelada');
ALTER TABLE "hojas_ruta" ALTER COLUMN "estado" TYPE "estado_hoja_ruta_new" USING ("estado"::text::"estado_hoja_ruta_new");
ALTER TYPE "estado_hoja_ruta" RENAME TO "estado_hoja_ruta_old";
ALTER TYPE "estado_hoja_ruta_new" RENAME TO "estado_hoja_ruta";
DROP TYPE "public"."estado_hoja_ruta_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "rol_usuario_new" AS ENUM ('inventariador', 'supervisor', 'administrador', 'custodio', 'director');
ALTER TABLE "usuario" ALTER COLUMN "rol" TYPE "rol_usuario_new" USING ("rol"::text::"rol_usuario_new");
ALTER TYPE "rol_usuario" RENAME TO "rol_usuario_old";
ALTER TYPE "rol_usuario_new" RENAME TO "rol_usuario";
DROP TYPE "public"."rol_usuario_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "procesos" DROP CONSTRAINT "procesos_cerrado_por_fkey";

-- DropForeignKey
ALTER TABLE "tarea_supervisor" DROP CONSTRAINT "tarea_supervisor_tarea_id_fkey";

-- DropForeignKey
ALTER TABLE "tarea_supervisor" DROP CONSTRAINT "tarea_supervisor_usuario_id_fkey";

-- DropIndex
DROP INDEX "bien_numero_key";

-- AlterTable
ALTER TABLE "bien" DROP COLUMN "ubicacion",
ADD COLUMN     "ajuste_inflacion" DECIMAL DEFAULT 0,
ADD COLUMN     "depreciacion_acumulada" DECIMAL DEFAULT 0,
ADD COLUMN     "fecha_baja" DATE,
ADD COLUMN     "motivo_baja" TEXT,
ADD COLUMN     "ubicacion_id" TEXT,
ADD COLUMN     "valor_neto" DECIMAL,
ADD COLUMN     "valor_residual" DECIMAL;

-- AlterTable
ALTER TABLE "bienes_hoja_ruta" DROP COLUMN "estado",
ADD COLUMN     "estado" "estado_bien_hoja_ruta" NOT NULL;

-- AlterTable
ALTER TABLE "codificador" DROP COLUMN "metodo_depreciacion";

-- AlterTable
ALTER TABLE "hojas_ruta" ADD COLUMN     "evento_inventario_id" TEXT;

-- AlterTable
ALTER TABLE "movimientos" ADD COLUMN     "estado" "estado_movimiento" NOT NULL DEFAULT 'solicitud';

-- AlterTable
ALTER TABLE "procesos" DROP COLUMN "cerrado_por",
ADD COLUMN     "cerrado_por_id" TEXT;

-- AlterTable
ALTER TABLE "registros_inventario" ADD COLUMN     "estado_conciliacion" "estado_conciliacion";

-- AlterTable
ALTER TABLE "tarea" DROP COLUMN "deriva_en_procesos";

-- DropTable
DROP TABLE "tarea_supervisor";

-- DropEnum
DROP TYPE "etapa_proceso";

-- DropEnum
DROP TYPE "metodo_depreciacion";

-- DropEnum
DROP TYPE "tipo_dato";

-- DropEnum
DROP TYPE "tipo_proceso_enum";

-- CreateTable
CREATE TABLE "tarea_usuario" (
    "id" TEXT NOT NULL,
    "tarea_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "fecha_asignacion" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rol" "rol_usuario",

    CONSTRAINT "tarea_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento_inventario" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "gestion_id" TEXT,
    "estado" "estado_evento_inventario" NOT NULL DEFAULT 'planificado',
    "alcance" TEXT,
    "fecha_inicio" DATE,
    "fecha_cierre" DATE,
    "creado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evento_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "novedad" (
    "id" TEXT NOT NULL,
    "evento_inventario_id" TEXT,
    "hoja_ruta_id" TEXT,
    "bien_id" TEXT,
    "tipo" "tipo_novedad" NOT NULL,
    "descripcion" TEXT,
    "estado" "estado_novedad" NOT NULL DEFAULT 'registrada',
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "novedad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gestion" (
    "id" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "estado" "estado_gestion" NOT NULL DEFAULT 'abierta',
    "fecha_cierre" DATE,
    "creado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ajuste_valor" (
    "id" TEXT NOT NULL,
    "bien_id" TEXT NOT NULL,
    "gestion_id" TEXT,
    "tipo" "tipo_ajuste" NOT NULL,
    "fecha" DATE NOT NULL,
    "valor_anterior" DECIMAL NOT NULL,
    "valor_nuevo" DECIMAL NOT NULL,
    "motivo" TEXT,

    CONSTRAINT "ajuste_valor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ufv" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "valor" DECIMAL NOT NULL,

    CONSTRAINT "ufv_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gestion_anio_key" ON "gestion"("anio");

-- CreateIndex
CREATE UNIQUE INDEX "ufv_fecha_key" ON "ufv"("fecha");

-- AddForeignKey
ALTER TABLE "bien" ADD CONSTRAINT "bien_ubicacion_id_fkey" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarea_usuario" ADD CONSTRAINT "tarea_usuario_tarea_id_fkey" FOREIGN KEY ("tarea_id") REFERENCES "tarea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarea_usuario" ADD CONSTRAINT "tarea_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_cerrado_por_id_fkey" FOREIGN KEY ("cerrado_por_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_inventario" ADD CONSTRAINT "evento_inventario_gestion_id_fkey" FOREIGN KEY ("gestion_id") REFERENCES "gestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_ruta" ADD CONSTRAINT "hojas_ruta_evento_inventario_id_fkey" FOREIGN KEY ("evento_inventario_id") REFERENCES "evento_inventario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedad" ADD CONSTRAINT "novedad_evento_inventario_id_fkey" FOREIGN KEY ("evento_inventario_id") REFERENCES "evento_inventario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedad" ADD CONSTRAINT "novedad_hoja_ruta_id_fkey" FOREIGN KEY ("hoja_ruta_id") REFERENCES "hojas_ruta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedad" ADD CONSTRAINT "novedad_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "bien"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ajuste_valor" ADD CONSTRAINT "ajuste_valor_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "bien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ajuste_valor" ADD CONSTRAINT "ajuste_valor_gestion_id_fkey" FOREIGN KEY ("gestion_id") REFERENCES "gestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
