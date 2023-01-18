import { PartialType } from '@nestjs/mapped-types';
import { CreateFloorBodyDto } from './create-floor.body.dto';

export class UpdateFloorDto extends PartialType(CreateFloorBodyDto) {}
