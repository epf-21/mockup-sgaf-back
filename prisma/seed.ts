import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

interface CodificadorSeed {
  codigo: string;
  nombre: string;
  clase: 'activo' | 'material';
  naturaleza: 'tangible' | 'intangible';
  depreciable: boolean;
  tasa_depreciacion: number | null;
  vida_util_meses: number | null;
  cuenta_contable: string;
}

const CODIFICADORES: CodificadorSeed[] = [
  {
    codigo: '2.1.3.01',
    nombre: 'COMPUTADOR PERSONAL',
    clase: 'activo',
    naturaleza: 'tangible',
    depreciable: true,
    tasa_depreciacion: 25,
    vida_util_meses: 48,
    cuenta_contable: '12310',
  },
  {
    codigo: '2.1.3.03',
    nombre: 'DISCO DURO',
    clase: 'activo',
    naturaleza: 'tangible',
    depreciable: true,
    tasa_depreciacion: 25,
    vida_util_meses: 48,
    cuenta_contable: '12310',
  },
  {
    codigo: '2.1.5.01',
    nombre: 'VEHÍCULO',
    clase: 'activo',
    naturaleza: 'tangible',
    depreciable: true,
    tasa_depreciacion: 20,
    vida_util_meses: 60,
    cuenta_contable: '12320',
  },
  {
    codigo: '3.1.0.01',
    nombre: 'TERRENO',
    clase: 'activo',
    naturaleza: 'tangible',
    depreciable: false,
    tasa_depreciacion: null,
    vida_util_meses: null,
    cuenta_contable: '12100',
  },
  {
    codigo: '4.1.0.01',
    nombre: 'LICENCIA DE SOFTWARE',
    clase: 'activo',
    naturaleza: 'intangible',
    depreciable: true,
    tasa_depreciacion: 33,
    vida_util_meses: 36,
    cuenta_contable: '13110',
  },
  {
    codigo: '5.1.0.01',
    nombre: 'PIZARRA ACRÍLICA',
    clase: 'material',
    naturaleza: 'tangible',
    depreciable: false,
    tasa_depreciacion: null,
    vida_util_meses: null,
    cuenta_contable: '51100',
  },
  {
    codigo: '2.1.3.05',
    nombre: 'MONITOR',
    clase: 'activo',
    naturaleza: 'tangible',
    depreciable: true,
    tasa_depreciacion: 25,
    vida_util_meses: 48,
    cuenta_contable: '12310',
  },
  {
    codigo: '2.1.3.06',
    nombre: 'IMPRESORA',
    clase: 'activo',
    naturaleza: 'tangible',
    depreciable: true,
    tasa_depreciacion: 25,
    vida_util_meses: 48,
    cuenta_contable: '12310',
  },
  {
    codigo: '2.1.3.07',
    nombre: 'ESCANER',
    clase: 'activo',
    naturaleza: 'tangible',
    depreciable: true,
    tasa_depreciacion: 25,
    vida_util_meses: 48,
    cuenta_contable: '12310',
  },
  {
    codigo: '2.1.6.01',
    nombre: 'PROYECTOR MULTIMEDIA',
    clase: 'activo',
    naturaleza: 'tangible',
    depreciable: true,
    tasa_depreciacion: 25,
    vida_util_meses: 48,
    cuenta_contable: '12310',
  },
  {
    codigo: '2.1.7.01',
    nombre: 'EQUIPO DE AUDIO',
    clase: 'activo',
    naturaleza: 'tangible',
    depreciable: true,
    tasa_depreciacion: 20,
    vida_util_meses: 60,
    cuenta_contable: '12310',
  },
  {
    codigo: '3.2.0.01',
    nombre: 'EDIFICIO',
    clase: 'activo',
    naturaleza: 'tangible',
    depreciable: true,
    tasa_depreciacion: 5,
    vida_util_meses: 240,
    cuenta_contable: '12410',
  },
  {
    codigo: '5.2.0.01',
    nombre: 'SILLA DE OFICINA',
    clase: 'material',
    naturaleza: 'tangible',
    depreciable: false,
    tasa_depreciacion: null,
    vida_util_meses: null,
    cuenta_contable: '51100',
  },
  {
    codigo: '5.2.0.02',
    nombre: 'ESCRITORIO',
    clase: 'material',
    naturaleza: 'tangible',
    depreciable: false,
    tasa_depreciacion: null,
    vida_util_meses: null,
    cuenta_contable: '51100',
  },
  {
    codigo: '6.1.0.01',
    nombre: 'MUEBLE DE ARCHIVO',
    clase: 'material',
    naturaleza: 'tangible',
    depreciable: false,
    tasa_depreciacion: null,
    vida_util_meses: null,
    cuenta_contable: '51100',
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida en el entorno');
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });
  let creados = 0;
  let actualizados = 0;

  try {
    for (const codificador of CODIFICADORES) {
      const existente = await prisma.codificador.findUnique({
        where: { codigo: codificador.codigo },
      });

      if (existente) {
        await prisma.codificador.update({
          where: { codigo: codificador.codigo },
          data: codificador,
        });
        actualizados += 1;
      } else {
        await prisma.codificador.create({
          data: codificador,
        });
        creados += 1;
      }
    }

    const total = await prisma.codificador.count();
    console.log(
      `Seed codificadores: ${creados} creados, ${actualizados} actualizados (total en BD: ${total})`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Error en seed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
