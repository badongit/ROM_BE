import { Transform } from 'class-transformer';
import { Allow, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsString()
  @IsOptional()
  keyword: string;

  @Allow()
  @Transform((value) =>
    !Number(value) || Number(value) <= 0 ? 1 : Number(value),
  )
  page: number;

  @Allow()
  @Transform((value) =>
    !Number(value) ||
    Number(value) <= 0 ||
    Number(value) > +process.env.MAX_LIMIT
      ? +process.env.LIMIT
      : Number(value),
  )
  limit: number;

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
