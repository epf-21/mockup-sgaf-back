import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const personas = [
  ['SEED-PER-001', 'Carlos Ramírez'],
  ['SEED-PER-002', 'Lucía Fernández'],
  ['SEED-PER-003', 'Miguel Vargas'],
  ['SEED-PER-004', 'Patricia Morales'],
  ['SEED-PER-005', 'Rodrigo Gutiérrez'],
  ['SEED-PER-006', 'Sofía Herrera'],
  ['SEED-PER-007', 'Daniela Castillo'],
  ['SEED-PER-008', 'Fernando Salazar'],
  ['SEED-PER-009', 'Gabriela Rojas'],
  ['SEED-PER-010', 'Andrés Mendoza'],
] as const;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida en el entorno');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    for (const [documento_identidad, nombre_completo] of personas) {
      await prisma.persona.upsert({
        where: { documento_identidad },
        update: { nombre_completo },
        create: {
          documento_identidad,
          nombre_completo,
        },
      });
    }

    console.log(`Seed de personas completado: ${personas.length} personas`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(
    'Error en seed de personas:',
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
