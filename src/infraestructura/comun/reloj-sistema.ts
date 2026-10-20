import { Injectable } from '@nestjs/common';
import { Reloj } from '../../aplicacion/comun/ports/reloj.port';

@Injectable()
export class RelojSistema extends Reloj {
  ahora(): Date {
    return new Date();
  }
}
