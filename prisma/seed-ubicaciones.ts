import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const ubicaciones = [
  {
    codigo: 'UBI-001',
    nombre: 'Oficina 301',
    tipo: 'ambiente' as const,
    unidad: 'DA-001',
  },
  {
    codigo: 'UBI-002',
    nombre: 'Laboratorio de cómputo 2',
    tipo: 'ambiente' as const,
    unidad: 'DA-001',
  },
  {
    codigo: 'UBI-003',
    nombre: 'Oficina Decanato',
    tipo: 'ambiente' as const,
    unidad: 'DA-004',
  },
  {
    codigo: 'UBI-004',
    nombre: 'Laboratorio de Materiales',
    tipo: 'ambiente' as const,
    unidad: 'DA-003',
  },
  {
    codigo: 'UBI-005',
    nombre: 'Oficina Investigación Secretaría',
    tipo: 'ambiente' as const,
    unidad: 'DA-002',
  },
  {
    codigo: 'UBI-006',
    nombre: 'Facultad de Ciencias y Tecnología',
    tipo: 'edificio' as const,
    unidad: 'DA-005',
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida en el entorno');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    for (const ubicacion of ubicaciones) {
      const unidad = await prisma.unidad_organizacional.findUnique({
        where: { codigo: ubicacion.unidad },
        select: { id: true },
      });

      const data = {
        nombre: ubicacion.nombre,
        tipo: ubicacion.tipo,
        unidad_id: unidad?.id ?? null,
      };

      await prisma.ubicacion.upsert({
        where: { codigo: ubicacion.codigo },
        update: data,
        create: { codigo: ubicacion.codigo, ...data },
      });
    }

    const total = await prisma.ubicacion.count();
    console.log(`Seed de ubicaciones completado (total en BD: ${total})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(
    'Error en seed de ubicaciones:',
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
