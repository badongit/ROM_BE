import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { RoleResponseDto } from './dto/role.response.dto';
import { RoleService } from './role.service';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'List' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: RoleResponseDto })
  list() {
    return this.roleService.list();
  }
}
