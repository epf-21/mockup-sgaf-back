import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CrearBienUseCase } from '../application/use-cases/crear-bien/crear-bien.use-case';
import { ListarBienesUseCase } from '../application/use-cases/listar-bienes.use-case';
import { CrearBienBody } from './dto/crear-bien.body';
import { CrearBienMapper } from './mappers/crear-bien.mapper';

@Controller('bienes')
export class BienesController {
  constructor(
    @Inject(ListarBienesUseCase)
    private readonly listarBienes: ListarBienesUseCase,
    @Inject(CrearBienUseCase)
    private readonly crearBien: CrearBienUseCase,
  ) {}

  @Get()
  getBienes() {
    return this.listarBienes.execute();
  }

  @Post()
  async crear(@Body() body: CrearBienBody) {
    const input = CrearBienMapper.bodyToInput(body);
    return this.crearBien.execute(input);
  }
}
