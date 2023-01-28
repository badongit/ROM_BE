import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createDishTable1674828173952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dishes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '127',
          },
          {
            name: 'image',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'int',
          },
          {
            name: 'price',
            type: 'int4',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'category_id',
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

    await queryRunner.createForeignKey(
      'dishes',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('dishes');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('category_id') !== -1,
    );
    await queryRunner.dropForeignKey('dishes', foreignKey);
    await queryRunner.dropTable('dishes');
  }
}
