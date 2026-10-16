import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { CodificadorGateway } from '../../dominio/catalogos/gateways/codificador.gateway';
import type {
  CodificadorDetalle,
  CodificadorResumen,
} from '../../dominio/catalogos/tipos/codificador';

@Injectable()
export class PrismaCodificadorGateway implements CodificadorGateway {
  constructor(private readonly prisma: PrismaService) {}

  async listarResumen(): Promise<CodificadorResumen[]> {
    return this.prisma.codificador.findMany({
      select: { id: true, codigo: true, nombre: true },
      orderBy: { codigo: 'asc' },
    });
  }

  async listarDetalle(): Promise<CodificadorDetalle[]> {
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
      metodo_depreciacion: c.metodo_depreciacion,
      cuenta_contable: c.cuenta_contable,
    }));
  }
}
