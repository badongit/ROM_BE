import { MigrationInterface, QueryRunner } from 'typeorm';

export class createExtensionUnaccent1675095636972
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION UNACCENT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION UNACCENT`);
  }
}
