import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { RoleEnum } from '@src/constants/enum/role.enum';
import { Roles } from '@src/core/decorators/roles.decorator';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ChangeStatusEmployeeBodyDto } from './dto/request/change-employee.body.dto';
import { CreateEmployeeBodyDto } from './dto/request/create-employee.body.dto';
import { ListEmployeeQueryDto } from './dto/request/list-employee.query.dto';
import { UpdateEmployeeByAdminBodyDto } from './dto/request/update-employee-by-admin.body.dto';
import { UpdateEmployeeByManagerBodyDto } from './dto/request/update-employee-by-manager.body.dto';
import { UpdateEmployeeBodyDto } from './dto/request/update-employee.body,dto';
import { DetailEmployeeResponseDto } from './dto/response/detail-employee.response.dto';
import { EmployeeResponseDto } from './dto/response/employee.response.dto';
import { IEmployeeService } from './interfaces/employee.service.interface';

@ApiBearerAuth()
@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(
    @Inject('IEmployeeService')
    private readonly employeeService: IEmployeeService,
  ) {}

  @Roles(RoleEnum.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: ResponseCodeEnum.CREATED })
  create(@Body() body: CreateEmployeeBodyDto) {
    return this.employeeService.create(body);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  @Get()
  @ApiOperation({ summary: 'List' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: EmployeeResponseDto })
  list(@Query() query: ListEmployeeQueryDto, @Req() req: any) {
    query.user = req.user;
    return this.employeeService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: DetailEmployeeResponseDto })
  detail(@Param() params: IdParamsDto) {
    return this.employeeService.detail(params);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  update(@Param() params: IdParamsDto, @Body() body: UpdateEmployeeBodyDto) {
    return this.employeeService.update({ ...params, ...body });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  delete(@Param() params: IdParamsDto) {
    return this.employeeService.delete(params);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change status' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  changeStatus(
    @Param() params: IdParamsDto,
    @Body() body: ChangeStatusEmployeeBodyDto,
  ) {
    return this.employeeService.changeStatus({ ...params, ...body });
  }

  @Roles(RoleEnum.MANAGER)
  @Patch(':id/manager')
  @ApiOperation({ summary: 'Update by manager' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  updateByManager(
    @Param() params: IdParamsDto,
    @Body() body: UpdateEmployeeByManagerBodyDto,
  ) {
    return this.employeeService.updateByManager({ ...params, ...body });
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':id/admin')
  @ApiOperation({ summary: 'Update by admin' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  updateByAdmin(
    @Param() params: IdParamsDto,
    @Body() body: UpdateEmployeeByAdminBodyDto,
  ) {
    return this.employeeService.updateByAdmin({ ...params, ...body });
  }
}
