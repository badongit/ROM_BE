import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANT } from '@src/constants/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { RoleEnum } from '@src/constants/enum/role.enum';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ApiError } from '@src/utils/api-error';
import { ResponseBuilder } from '@src/utils/response-builder';
import { Request } from 'express';
import { DetailEmployeeResponseDto } from '../employee/dto/response/detail-employee.response.dto';
import { IEmployeeRepository } from '../employee/interfaces/employee.repository.interface';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { IAuthenticationService } from './interfaces/authentication.service.interface';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(REQUEST)
    private readonly request: Request,

    @Inject('IEmployeeRepository')
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async login(
    request: LoginRequestDto,
  ): Promise<ResponsePayload<LoginResponseDto | any>> {
    const { phone_number, password } = request;
    const employee = await this.employeeRepository.findOne({
      where: { phone_number: phone_number },
      relations: {
        role: true,
      },
    });

    if (!employee || !employee.validatePassword(password)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.PHONE_NUMBER_OR_PASSWORD_WRONG,
      ).toResponse();
    }

    const access_token = this._createToken(employee.id, employee.role.code);
    const refresh_token = this._createRefreshToken(employee.id);

    return new ResponseBuilder({ access_token, refresh_token }).build();
  }

  async validateToken(): Promise<
    ResponsePayload<DetailEmployeeResponseDto | any>
  > {
    const token = this.request.headers['authorization']?.split(' ')?.[1];

    try {
      this.jwtService.verify(token);
      const decoded: any = this.jwtService.decode(token);
      const employee = await this.employeeRepository.findOne({
        where: { id: decoded.id },
        relations: { role: true },
      });

      if (!employee) {
        return new ApiError(
          ResponseCodeEnum.UNAUTHORIZED,
          MessageEnum.UNAUTHORIZED,
        ).toResponse();
      }

      return new ResponseBuilder(employee).build();
    } catch (error) {
      if (error.constructor.name === 'TokenExpiredError') {
        return new ApiError(
          ResponseCodeEnum.FORBIDDEN,
          error.message,
        ).toResponse();
      }
      return new ApiError(
        ResponseCodeEnum.UNAUTHORIZED,
        error.message,
      ).toResponse();
    }
  }

  _createToken(id: number, role: RoleEnum): string {
    const expiresIn = JWT_CONSTANT.JWT_ACCESS_TOKEN_EXPIRES_IN;
    const secret = JWT_CONSTANT.JWT_ACCESS_TOKEN_SECRET;

    const token = this.jwtService.sign({ id, role }, { expiresIn, secret });

    return token;
  }

  _createRefreshToken(id: number): string {
    const expiresIn = JWT_CONSTANT.JWT_REFRESH_TOKEN_EXPIRES_IN;
    const secret = JWT_CONSTANT.JWT_REFRESH_TOKEN_SECRET;

    const token = this.jwtService.sign({ id }, { expiresIn, secret });

    return token;
  }
}
