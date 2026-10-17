-- AlterTable
ALTER TABLE "tarea" ADD COLUMN "codigo" VARCHAR(30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tarea_codigo_key" ON "tarea"("codigo");
