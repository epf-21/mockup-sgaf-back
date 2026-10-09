import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

export interface AtributoCatalogo {
  codigo: string;
  nombre: string;
  tipo_dato: string;
  unidad_medida?: string;
  obligatorio: boolean;
  orden: number;
}

export interface CodificadorCatalogo {
  codigo: string;
  atributos: AtributoCatalogo[];
}

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  private leerCatalogoAtributos(): Map<string, AtributoCatalogo[]> {
    const ruta = join(process.cwd(), 'prisma', 'catalogos', 'atributos.json');
    const catalogo = JSON.parse(readFileSync(ruta, 'utf-8')) as {
      codificadores: CodificadorCatalogo[];
    };
    return new Map(catalogo.codificadores.map((c) => [c.codigo, c.atributos]));
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
}
