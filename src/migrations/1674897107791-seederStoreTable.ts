import { Store } from '@src/components/store/entities/store.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class seederStoreTable1674897107791 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Store)
      .values([
        {
          name: 'Hailidao',
          image: 'images',
          phone_number: '0123456789',
          address: 'thành phố Bình Dương',
          description: 'Quán lẩu bình thường ở Bình Dương',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable('stores');
  }
}
