import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const usuarios = [
  ...Array.from({ length: 10 }, (_, index) => {
    const numero = String(index + 1).padStart(2, '0');
    return {
      documento_identidad: `SEED-INV-${numero}`,
      nombre_completo: `Inventariador Demo ${index + 1}`,
      email: `inventariador${index + 1}@demo.local`,
      rol: 'inventariador' as const,
    };
  }),
  ...Array.from({ length: 5 }, (_, index) => {
    const numero = String(index + 1).padStart(2, '0');
    return {
      documento_identidad: `SEED-SUP-${numero}`,
      nombre_completo: `Supervisor Demo ${index + 1}`,
      email: `supervisor${index + 1}@demo.local`,
      rol: 'supervisor' as const,
    };
  }),
  {
    documento_identidad: 'SEED-ADM-01',
    nombre_completo: 'Administrador Demo',
    email: 'administrador@demo.local',
    rol: 'administrador' as const,
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
    for (const usuario of usuarios) {
      const persona = await prisma.persona.upsert({
        where: { documento_identidad: usuario.documento_identidad },
        update: {
          nombre_completo: usuario.nombre_completo,
          email: usuario.email,
        },
        create: {
          documento_identidad: usuario.documento_identidad,
          nombre_completo: usuario.nombre_completo,
          email: usuario.email,
        },
        select: { id: true },
      });

      await prisma.usuario.upsert({
        where: { email: usuario.email },
        update: {
          persona_id: persona.id,
          rol: usuario.rol,
          activo: true,
        },
        create: {
          persona_id: persona.id,
          email: usuario.email,
          rol: usuario.rol,
          activo: true,
        },
      });
    }

    console.log(`Seed de usuarios completado: ${usuarios.length} usuarios`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(
    'Error en seed de usuarios:',
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
