import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createOrderTable1675146958826 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '15',
          },
          {
            name: 'payment_reality',
            type: 'int4',
          },
          {
            name: 'payment_method',
            type: 'int',
          },
          {
            name: 'point_used',
            type: 'int4',
            default: 0,
          },
          {
            name: 'status',
            type: 'int',
          },
          {
            name: 'type',
            type: 'int',
          },
          {
            name: 'note',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'table_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'customer_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'cashier_id',
            type: 'int',
          },
          {
            name: 'waiting_ticket',
            type: 'varchar',
            length: '5',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('orders', [
      new TableForeignKey({
        columnNames: ['table_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tables',
      }),
      new TableForeignKey({
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
      }),
      new TableForeignKey({
        columnNames: ['cashier_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employees',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('orders');
    const foreignKeys = table.foreignKeys.filter(
      (fk) =>
        fk.columnNames.indexOf('table_id') !== -1 ||
        fk.columnNames.indexOf('customer_id') !== -1 ||
        fk.columnNames.indexOf('cashier_id') !== -1,
    );
    await queryRunner.dropForeignKeys('orders', foreignKeys);
    await queryRunner.dropTable('orders');
  }
}
