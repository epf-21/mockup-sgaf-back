import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const personas = [
  {
    documento_identidad: 'SEED-RESP-001',
    nombre_completo: 'María López',
    email: 'maria.lopez@demo.local',
  },
  {
    documento_identidad: 'SEED-RESP-002',
    nombre_completo: 'Jhonny Ceballos',
    email: 'jhonny.ceballos@demo.local',
  },
  {
    documento_identidad: 'SEED-RESP-003',
    nombre_completo: 'Ana Martínez',
    email: 'ana.martinez@demo.local',
  },
];

const unidades = [
  {
    codigo: 'DA-001',
    nombre: 'Centro de Cómputo Auditoría',
    tipo: 'departamento' as const,
    responsable: 'SEED-RESP-001',
  },
  {
    codigo: 'DA-002',
    nombre: 'Oficina Investigación Secretaría',
    tipo: 'direccion' as const,
    responsable: 'SEED-RESP-002',
  },
  {
    codigo: 'DA-003',
    nombre: 'Laboratorio de Materiales',
    tipo: 'departamento' as const,
    responsable: 'SEED-RESP-003',
  },
  {
    codigo: 'DA-004',
    nombre: 'Oficina Decanato',
    tipo: 'direccion' as const,
    responsable: 'SEED-RESP-002',
  },
  {
    codigo: 'DA-005',
    nombre: 'Facultad de Ciencias y Tecnología',
    tipo: 'facultad' as const,
    responsable: 'SEED-RESP-003',
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
    const personasPorDocumento = new Map<string, string>();

    for (const persona of personas) {
      const registro = await prisma.persona.upsert({
        where: { documento_identidad: persona.documento_identidad },
        update: {
          nombre_completo: persona.nombre_completo,
          email: persona.email,
        },
        create: persona,
        select: { id: true, documento_identidad: true },
      });
      personasPorDocumento.set(registro.documento_identidad, registro.id);
    }

    for (const unidad of unidades) {
      const responsableId = personasPorDocumento.get(unidad.responsable);
      if (!responsableId) {
        throw new Error(`Responsable no encontrado: ${unidad.responsable}`);
      }

      await prisma.unidad_organizacional.upsert({
        where: { codigo: unidad.codigo },
        update: {
          nombre: unidad.nombre,
          tipo: unidad.tipo,
          responsable_id: responsableId,
        },
        create: {
          codigo: unidad.codigo,
          nombre: unidad.nombre,
          tipo: unidad.tipo,
          responsable_id: responsableId,
        },
      });
    }

    console.log(`Seed de unidades completado: ${unidades.length} unidades`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(
    'Error en seed de unidades:',
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
