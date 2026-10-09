import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from './database/prisma.service';
import { BienValidator, type BienCreateData } from './bienes/bienes.validator';
import { CrearBienBody } from './bienes/bienes.types';

@Injectable()
export class AppService {
  private readonly bienValidator: BienValidator;

  constructor(private readonly prisma: PrismaService) {
    this.bienValidator = new BienValidator(prisma);
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getCodificadoresResumen() {
    return this.prisma.codificador.findMany({
      select: { id: true, codigo: true, nombre: true },
      orderBy: { codigo: 'asc' },
    });
  }

  async getCodificadores() {
    return this.prisma.codificador.findMany({
      orderBy: { codigo: 'asc' },
    });
  }

  async getCodificadoresAtributos() {
    const codificadores = await this.prisma.codificador.findMany({
      select: { id: true, codigo: true },
      orderBy: { codigo: 'asc' },
    });
    const atributosPorCodigo = this.leerCatalogoAtributos();

    return codificadores.map((c) => ({
      id: c.id,
      codigo: c.codigo,
      atributos: atributosPorCodigo.get(c.codigo) ?? [],
    }));
  }

  async getUnidades() {
    return this.prisma.unidad_organizacional.findMany({
      select: {
        id: true,
        nombre: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async getUsuarios() {
    const usuarios = await this.prisma.usuario.findMany({
      where: {
        activo: true,
        rol: {
          in: ['inventariador', 'supervisor', 'administrador'],
        },
      },
      select: {
        id: true,
        rol: true,
        email: true,
        persona: {
          select: {
            nombre_completo: true,
          },
        },
      },
      orderBy: { persona: { nombre_completo: 'asc' } },
    });

    return usuarios.map(({ id, rol, email, persona }) => ({
      id,
      nombre: persona?.nombre_completo ?? email,
      rol,
    }));
  }

  async getPersonas() {
    const personas = await this.prisma.persona.findMany({
      select: {
        id: true,
        nombre_completo: true,
      },
      orderBy: { nombre_completo: 'asc' },
    });

    return personas.map(({ id, nombre_completo }) => ({
      id,
      nombre: nombre_completo,
    }));
  }

  async crearBien(body: CrearBienBody) {
    const padre = await this.bienValidator.validateParent(body);
    const componentes = body.componentes ?? [];

    const componentesValidados: BienCreateData[] = [];
    for (const [index, componente] of componentes.entries()) {
      componentesValidados.push(
        await this.bienValidator.validateComponent(componente, index, {
          unidad_id: padre.unidad_id,
          responsable_id: padre.responsable_id,
          ubicacion: padre.ubicacion ?? null,
        }),
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const bienPadre = await tx.bien.create({
        data: {
          ...padre,
          numero: await this.generarNumero(tx),
        },
      });

      const bienesComponentes: Prisma.bienGetPayload<object>[] = [];
      for (const componente of componentesValidados) {
        bienesComponentes.push(
          await tx.bien.create({
            data: {
              ...componente,
              padre_id: bienPadre.id,
              numero: await this.generarNumero(tx),
            },
          }),
        );
      }

      return {
        ...bienPadre,
        componentes: bienesComponentes,
      };
    });
  }

  private leerCatalogoAtributos() {
    return this.bienValidator.readCatalog();
  }

  private async generarNumero(tx: Prisma.TransactionClient) {
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
