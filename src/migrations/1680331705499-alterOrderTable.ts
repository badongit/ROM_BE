import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterOrderTable1680331705499 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('orders', [
      {
        oldColumn: new TableColumn({
          name: 'payment_reality',
          type: 'int4',
        }),
        newColumn: new TableColumn({
          name: 'payment_reality',
          type: 'int4',
          isNullable: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'payment_method',
          type: 'int',
        }),
        newColumn: new TableColumn({
          name: 'payment_method',
          type: 'int',
          isNullable: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'cashier_id',
          type: 'int',
        }),
        newColumn: new TableColumn({
          name: 'cashier_id',
          type: 'int',
          isNullable: true,
        }),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('orders', [
      {
        newColumn: new TableColumn({
          name: 'payment_reality',
          type: 'int4',
        }),
        oldColumn: new TableColumn({
          name: 'payment_reality',
          type: 'int4',
          isNullable: true,
        }),
      },
      {
        newColumn: new TableColumn({
          name: 'payment_method',
          type: 'int',
        }),
        oldColumn: new TableColumn({
          name: 'payment_method',
          type: 'int',
          isNullable: true,
        }),
      },
      {
        newColumn: new TableColumn({
          name: 'cashier_id',
          type: 'int',
        }),
        oldColumn: new TableColumn({
          name: 'cashier_id',
          type: 'int',
          isNullable: true,
        }),
      },
    ]);
  }
}
