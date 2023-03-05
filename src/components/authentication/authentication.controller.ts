import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { Public } from '@src/core/decorators/public.decorator';
import { GetTokenBodyDto } from './dto/request/get-token.body.dto';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { IAuthenticationService } from './interfaces/authentication.service.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    @Inject('IAuthenticationService')
    private readonly authenticationService: IAuthenticationService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: LoginResponseDto })
  login(@Body() body: LoginRequestDto) {
    return this.authenticationService.login(body);
  }

  @Public()
  @Post('/token')
  @ApiOperation({ summary: 'Get token' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  getToken(@Body() body: GetTokenBodyDto) {
    return this.authenticationService.getToken(body);
  }
}
