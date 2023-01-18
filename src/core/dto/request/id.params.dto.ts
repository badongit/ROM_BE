import { IsInt, IsNotEmpty } from 'class-validator';

export class IdParamsDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
