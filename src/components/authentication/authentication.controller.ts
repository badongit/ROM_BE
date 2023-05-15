import { Body, Controller, Get, Inject, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { Public } from '@src/core/decorators/public.decorator';
import { GetTokenBodyDto } from './dto/request/get-token.body.dto';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { GetTokenResponseDto } from './dto/response/get-token.response.dto';
import { IAuthenticationService } from './interfaces/authentication.service.interface';
import { Req } from '@nestjs/common/decorators';
import { plainToClass } from 'class-transformer';
import { DetailEmployeeResponseDto } from '../employee/dto/response/detail-employee.response.dto';
import { ResponseBuilder } from '@src/utils/response-builder';
import { UpdatePasswordBodyDto } from './dto/request/update-password.body.dtp';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    @Inject('IAuthenticationService')
    private readonly authenticationService: IAuthenticationService,
  ) {}

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: LoginResponseDto })
  login(@Body() body: LoginRequestDto) {
    return this.authenticationService.login(body);
  }

  @Public()
  @Post('/token')
  @ApiOperation({ summary: 'Get token' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: GetTokenResponseDto })
  getToken(@Body() body: GetTokenBodyDto) {
    return this.authenticationService.getToken(body);
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get me' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: DetailEmployeeResponseDto })
  getMe(@Req() req) {
    const dataReturn = plainToClass(DetailEmployeeResponseDto, req.user, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn).build();
  }

  @Put('/password')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: DetailEmployeeResponseDto })
  changePassword(@Body() body: UpdatePasswordBodyDto, @Req() req) {
    return this.authenticationService.updatePassword({
      ...body,
      user: req.user,
    });
  }
}
