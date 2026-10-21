import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { CodificadorRepository } from '../../aplicacion/catalogos/ports/codificador.repository';
import type { CodificadorDetalleOutput } from '../../aplicacion/catalogos/output/listar-codificadores-detalle.output';
import type { CodificadorResumenOutput } from '../../aplicacion/catalogos/output/listar-codificadores-resumen.output';

@Injectable()
export class PrismaCodificadorRepository implements CodificadorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listarResumen(): Promise<CodificadorResumenOutput[]> {
    return this.prisma.codificador.findMany({
      select: { id: true, codigo: true, nombre: true },
      orderBy: { codigo: 'asc' },
    });
  }

  async listarDetalle(): Promise<CodificadorDetalleOutput[]> {
    const codificadores = await this.prisma.codificador.findMany({
      orderBy: { codigo: 'asc' },
    });

    return codificadores.map((c) => ({
      id: c.id,
      codigo: c.codigo,
      nombre: c.nombre,
      clase: c.clase,
      naturaleza: c.naturaleza,
      depreciable: c.depreciable,
      tasa_depreciacion: c.tasa_depreciacion?.toString() ?? null,
      vida_util_meses: c.vida_util_meses,
      cuenta_contable: c.cuenta_contable,
    }));
  }
}
