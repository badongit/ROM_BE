import { SortEnum } from './../../../constants/enum/sort.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Allow,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class Sort {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @ApiProperty()
  @IsEnum(SortEnum)
  @IsNotEmpty()
  order: string;
}
export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 'tang' })
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiPropertyOptional({ example: '1' })
  @Allow()
  @Transform((value) =>
    !Number(value) || Number(value) <= 0 ? 1 : Number(value),
  )
  page: number;

  @ApiPropertyOptional({ example: '10' })
  @Allow()
  limit: number;

  @ApiPropertyOptional({ example: '+name,-createdAt' })
  @Transform(({ value }) => {
    if (value instanceof Array) {
      return value;
    }

    if (value instanceof String) {
      if (value) value = value.replace(/\\/g, '');
      const sortArr: Sort[] = value.split(',').reduce((pre, val) => {
        if (val.trim() !== '') {
          const sort = new Sort();
          switch (val[0]) {
            case '-':
              sort.order = SortEnum.DESC;
              break;
            default:
              sort.order = SortEnum.ASC;
              break;
          }
          sort.column = val.replace(/\+|\-/g, '');

          pre.push(sort);
        }
      }, []);

      return sortArr;
    }

    return [];
  })
  @IsOptional()
  sort: Sort[];

  get take(): number {
    const limit =
      !Number(this.limit) ||
      Number(this.limit) <= 0 ||
      Number(this.limit) > +process.env.MAX_LIMIT
        ? +process.env.LIMIT
        : Number(this.limit);

    return limit;
  }

  get skip(): number {
    const page =
      !Number(this.page) || Number(this.page) <= 0 ? 1 : Number(this.page);

    return page * this.take;
  }
}
