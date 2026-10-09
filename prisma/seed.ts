import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Ruta relativa al cwd del proyecto (donde se ejecuta npm run db:seed)
const CATALOGO_PATH = join(process.cwd(), 'prisma', 'catalogos', 'atributos.json');

// ─── Tipos del catálogo ──────────────────────────────────────
interface AtributoCatalogo {
  codigo: string;
  nombre: string;
  tipo_dato: string;
  unidad_medida?: string;
  obligatorio: boolean;
  orden: number;
}

interface CodificadorCatalogo {
  codigo: string;
  nombre: string;
  clase: 'activo' | 'material';
  naturaleza: 'tangible' | 'intangible';
  depreciable: boolean;
  tasa_depreciacion: number | null;
  vida_util_meses: number | null;
  cuenta_contable: string;
  atributos: AtributoCatalogo[];
}

interface CatalogoAtributos {
  codificadores: CodificadorCatalogo[];
}

// ─── Validación del JSON ─────────────────────────────────────
function validarCatalogo(catalogo: unknown): asserts catalogo is CatalogoAtributos {
  if (!catalogo || typeof catalogo !== 'object') {
    throw new Error('El catálogo debe ser un objeto JSON');
  }
  const c = catalogo as Record<string, unknown>;
  if (!Array.isArray(c.codificadores)) {
    throw new Error('El catálogo debe tener un arreglo "codificadores"');
  }
  for (const cod of c.codificadores as CodificadorCatalogo[]) {
    if (!cod.codigo || !cod.nombre || !cod.clase || !cod.naturaleza) {
      throw new Error(`Codificador incompleto: ${JSON.stringify(cod)}`);
    }
    if (!Array.isArray(cod.atributos)) {
      throw new Error(`Codificador ${cod.codigo} sin arreglo "atributos"`);
    }
  }
}

// ─── Seed ────────────────────────────────────────────────────
async function main() {
  const ruta = CATALOGO_PATH;
  let catalogo: CatalogoAtributos;

  try {
    const raw = readFileSync(ruta, 'utf-8');
    catalogo = JSON.parse(raw) as CatalogoAtributos;
    validarCatalogo(catalogo);
  } catch (err) {
    throw new Error(`No se pudo leer/validar el catálogo: ${(err as Error).message}`);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida en el entorno');
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  let creados = 0;
  let actualizados = 0;
  const errores: string[] = [];

  try {
    for (const c of catalogo.codificadores) {
      try {
        const datos = {
          nombre: c.nombre,
          clase: c.clase,
          naturaleza: c.naturaleza,
          depreciable: c.depreciable,
          tasa_depreciacion: c.tasa_depreciacion,
          vida_util_meses: c.vida_util_meses,
          cuenta_contable: c.cuenta_contable,
        };

        const existente = await prisma.codificador.findUnique({
          where: { codigo: c.codigo },
        });

        if (existente) {
          await prisma.codificador.update({
            where: { codigo: c.codigo },
            data: datos,
          });
          actualizados += 1;
        } else {
          await prisma.codificador.create({
            data: { codigo: c.codigo, ...datos },
          });
          creados += 1;
        }
      } catch (err) {
        errores.push(`${c.codigo}: ${(err as Error).message}`);
      }
    }

    const total = await prisma.codificador.count();

    if (errores.length > 0) {
      console.error('Errores durante el seed:');
      for (const e of errores) {
        console.error(`  - ${e}`);
      }
    }

    console.log(
      `Seed codificadores: ${creados} creados, ${actualizados} actualizados (total en BD: ${total})`,
    );

    if (errores.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Error en seed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
