import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { CreateCustomerBodyDto } from './dto/request/create-customer.body.dto';
import { ListCustomerQueryDto } from './dto/request/list-customer.query.dto';
import { UpdateCustomerBodyDto } from './dto/request/update-customer.body.dto';
import { CustomerResponseDto } from './dto/response/customer.response.dto';
import { DetailCustomerResponseDto } from './dto/response/detail-customer.response.dto';
import { ICustomerService } from './interfaces/customer.service.interface';

@ApiBearerAuth()
@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(
    @Inject('ICustomerService')
    private readonly customerService: ICustomerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: ResponseCodeEnum.CREATED })
  create(@Body() createCustomerDto: CreateCustomerBodyDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'List' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: CustomerResponseDto })
  list(@Query() query: ListCustomerQueryDto) {
    return this.customerService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: DetailCustomerResponseDto })
  detail(@Param() params: IdParamsDto) {
    return this.customerService.detail(params);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  update(@Param() params: IdParamsDto, @Body() body: UpdateCustomerBodyDto) {
    return this.customerService.update({ ...params, ...body });
  }
}
