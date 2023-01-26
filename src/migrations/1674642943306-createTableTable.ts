import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTableTable1674642943306 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tables',
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
            length: '7',
            isUnique: true,
          },
          {
            name: 'status',
            type: 'int',
          },
          {
            name: 'max_people',
            type: 'int',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'note',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'floor_id',
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
      'tables',
      new TableForeignKey({
        columnNames: ['floor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'floors',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('tables');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('floor_id') !== -1,
    );
    await queryRunner.dropForeignKey('tables', foreignKey);

    await queryRunner.dropTable('tables');
  }
}
