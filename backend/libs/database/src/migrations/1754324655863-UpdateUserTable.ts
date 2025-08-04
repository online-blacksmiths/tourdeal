import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTable1754324655863 implements MigrationInterface {
  name = 'UpdateUserTable1754324655863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(100) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`nickname\` \`nickname\` varchar(100) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`nickname\` \`nickname\` varchar(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(100) NOT NULL`,
    );
  }
}
