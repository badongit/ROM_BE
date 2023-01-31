import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createOrderDetailsTable1675148954178
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_details',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'price',
            type: 'int4',
          },
          {
            name: 'status',
            type: 'int',
          },
          {
            name: 'note',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'order_id',
            type: 'int',
          },
          {
            name: 'dish_id',
            type: 'int',
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

    await queryRunner.createForeignKeys('order_details', [
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
      }),
      new TableForeignKey({
        columnNames: ['dish_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'dishes',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('order_details');
    const foreignKeys = table.foreignKeys.filter(
      (fk) =>
        fk.columnNames.indexOf('order_id') !== -1 ||
        fk.columnNames.indexOf('dish_id') !== -1,
    );
    await queryRunner.dropForeignKeys('order_details', foreignKeys);
    await queryRunner.dropTable('order_details');
  }
}
