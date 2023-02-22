import { Role } from '@src/components/role/entities/role.entity';
import { RoleEnum } from '@src/constants/enum/role.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class seederRoleTable1674904400741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values([
        {
          name: 'Phục vụ',
          code: RoleEnum.WAITER,
        },
        {
          name: 'Phụ bếp',
          code: RoleEnum.COOK,
        },
        {
          name: 'Thu ngân',
          code: RoleEnum.CASHIER,
        },
        {
          name: 'Quản lý',
          code: RoleEnum.MANAGER,
        },
        {
          name: 'Admin',
          code: RoleEnum.ADMIN,
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable('roles');
  }
}
