import { IsUUID } from 'class-validator';

export class CerrarTareaBody {
  @IsUUID('4')
  usuario_id!: string;
}
