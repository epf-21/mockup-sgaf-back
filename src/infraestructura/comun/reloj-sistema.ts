import { Injectable } from '@nestjs/common';
import { Reloj } from '../../dominio/comun/reloj';

@Injectable()
export class RelojSistema extends Reloj {
  ahora(): Date {
    return new Date();
  }
}
