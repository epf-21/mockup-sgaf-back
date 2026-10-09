import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('codificadores')
  getCodificadoresResumen() {
    return this.appService.getCodificadoresResumen();
  }

  @Get('codificadores/detalle')
  getCodificadores() {
    return this.appService.getCodificadores();
  }

  @Get('codificadores/atributos')
  getCodificadoresAtributos() {
    return this.appService.getCodificadoresAtributos();
  }

  @Get('unidades')
  getUnidades() {
    return this.appService.getUnidades();
  }

  @Get('usuarios')
  getUsuarios() {
    return this.appService.getUsuarios();
  }

  @Get('personas')
  getPersonas() {
    return this.appService.getPersonas();
  }
}
