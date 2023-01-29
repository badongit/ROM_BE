import { Role } from '@src/components/role/entities/role.entity';
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
          code: 'WAITER',
        },
        {
          name: 'Phụ bếp',
          code: 'COOK',
        },
        {
          name: 'Thu ngân',
          code: 'CASHIER',
        },
        {
          name: 'Quản lý',
          code: 'MANAGER',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable('roles');
  }
}
