import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from '@src/constants/enum/role.enum';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { Like, Not, Repository } from 'typeorm';
import { RoleResponseDto } from './dto/role.response.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async list(): Promise<ResponsePayload<RoleResponseDto>> {
    const roles = await this.roleRepository.find({
      where: {
        code: Not(Like(RoleEnum.ADMIN)),
      },
    });

    const dataReturn = plainToClass(RoleResponseDto, roles, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      items: dataReturn,
      meta: { page: 1, total: roles.length },
    }).build();
  }
}
