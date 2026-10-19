import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base-datos/prisma.service';
import type { TipoProcesoCatalogoGateway } from '../../dominio/catalogos/gateways/tipo-proceso.gateway';
import type { TipoProcesoCatalogo } from '../../dominio/catalogos/tipos/tipo-proceso';

const SELECT = {
  id: true,
  codigo: true,
  nombre: true,
  categoria: true,
  requiere_autorizacion: true,
  requiere_ejecucion_campo: true,
  requiere_aceptacion_custodia: true,
  genera_formulario: true,
  genera_movimiento: true,
  afecta_patrimonio: true,
  afecta_depreciacion: true,
} as const;

@Injectable()
export class PrismaTipoProcesoCatalogoGateway implements TipoProcesoCatalogoGateway {
  constructor(private readonly prisma: PrismaService) {}

  async listar(categoria: string | null): Promise<TipoProcesoCatalogo[]> {
    const tipos = await this.prisma.tipo_proceso.findMany({
      where: categoria ? { categoria: categoria as never } : undefined,
      select: SELECT,
      orderBy: [{ categoria: 'asc' }, { nombre: 'asc' }],
    });

    return tipos.map((tipo) => ({ ...tipo }));
  }

  async obtener(id: string): Promise<TipoProcesoCatalogo | null> {
    const tipo = await this.prisma.tipo_proceso.findUnique({
      where: { id },
      select: SELECT,
    });

    return tipo ? { ...tipo } : null;
  }
}
