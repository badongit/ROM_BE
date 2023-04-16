import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@src/core/dto/request/pagination.query.dto';
import { IsOptional, IsString } from 'class-validator';

export class ListCustomerQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: '03453241245' })
  @IsString()
  @IsOptional()
  phoneNumber: string;
}
