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
  order: 'DESC' | 'ASC';
}
export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 'tang' })
  @Transform(({ value }) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[?%\\_]/gi, function (x) {
        return '\\' + x;
      }),
  )
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiPropertyOptional({ example: '1' })
  @Allow()
  @Transform(({ value }) =>
    !Number(value) || Number(value) <= 0 ? 1 : Number(value),
  )
  page: number;

  @Transform(({ value }) => +value)
  isGetAll: number;

  @ApiPropertyOptional({ example: '10' })
  @Allow()
  limit: number;

  user?: any;

  @ApiPropertyOptional({ example: '+name,-createdAt' })
  @Transform(({ value }) => {
    if (value instanceof Array) {
      return value;
    }

    if (typeof value === 'string') {
      if (value) value = value.replace(/\\/g, '');
      const sortArr: Sort[] = [];
      value.split(',').forEach((val) => {
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

          sortArr.push(sort);
        }
      });

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

    return (page - 1) * this.take;
  }
}
