import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import type { BienRepositoryPort } from '../domain/ports/bien-repository.port';
import type {
  AtributosBien,
  BienCreado,
  BienResumen,
  NuevoBien,
} from '../domain/tipos/bien';

const ESTADO_BIEN_LABEL: Record<string, string> = {
  en_registro: 'En registro',
  activo: 'Activo',
  fuera_de_servicio: 'Fuera de servicio',
  en_prestamo: 'En prestamo',
  baja: 'Baja',
};

function serializarAtributos(atributos: AtributosBien): string | null {
  const entradas = Object.entries(atributos);
  if (entradas.length === 0) return null;
  return entradas.map(([clave, valor]) => `${clave}: ${valor}`).join(', ');
}

@Injectable()
export class PrismaBienRepository implements BienRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async listarRaiz(): Promise<BienResumen[]> {
    const bienes = await this.prisma.bien.findMany({
      where: {
        padre_id: null,
      },
      select: {
        id: true,
        padre_id: true,
        numero: true,
        descripcion: true,
        estado: true,
        codificador: {
          select: {
            codigo: true,
            clase: true,
          },
        },
        unidad: {
          select: {
            nombre: true,
          },
        },
        responsable: {
          select: {
            nombre_completo: true,
          },
        },
      },
      orderBy: {
        numero: 'asc',
      },
    });

    return bienes.map((bien) => ({
      id: bien.id,
      codigo: `${bien.padre_id || bien.codificador.clase === 'material' ? 'NIM' : 'NIA'}-${String(
        bien.numero,
      ).padStart(5, '0')}`,
      descripcion: bien.descripcion,
      codificador: bien.codificador.codigo,
      unidad: bien.unidad.nombre,
      responsable: bien.responsable.nombre_completo,
      estado: ESTADO_BIEN_LABEL[bien.estado] ?? bien.estado,
    }));
  }

  async existeNumero(numero: number): Promise<boolean> {
    const existente = await this.prisma.bien.findUnique({
      where: { numero },
      select: { id: true },
    });
    return existente !== null;
  }

  async crearConComponentes(
    padre: NuevoBien,
    componentes: NuevoBien[],
  ): Promise<BienCreado> {
    return this.prisma.$transaction(async (tx) => {
      const bienPadre = await tx.bien.create({
        data: {
          ...padre,
          atributos: serializarAtributos(padre.atributos),
          numero: await this.generarNumero(tx),
        },
      });

      const bienesComponentes: {
        id: string;
        numero: number;
        descripcion: string;
      }[] = [];
      for (const componente of componentes) {
        const creado = await tx.bien.create({
          data: {
            ...componente,
            atributos: serializarAtributos(componente.atributos),
            padre_id: bienPadre.id,
            numero: await this.generarNumero(tx),
          },
        });
        bienesComponentes.push({
          id: creado.id,
          numero: creado.numero,
          descripcion: creado.descripcion,
        });
      }

      return {
        id: bienPadre.id,
        numero: bienPadre.numero,
        descripcion: bienPadre.descripcion,
        componentes: bienesComponentes,
      };
    });
  }

  private async generarNumero(tx: {
    bien: {
      findUnique: (args: {
        where: { numero: number };
        select: { id: boolean };
      }) => Promise<{ id: string } | null>;
    };
  }): Promise<number> {
    for (let intento = 0; intento < 20; intento += 1) {
      const numero = Math.floor(10000 + Math.random() * 90000);
      const existente = await tx.bien.findUnique({
        where: { numero },
        select: { id: true },
      });
      if (!existente) return numero;
    }
    throw new BadRequestException('No se pudo generar un número NIA/NIM único');
  }
}
