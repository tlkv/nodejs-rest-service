import { MigrationInterface, QueryRunner } from 'typeorm';

export class first1658858217156 implements MigrationInterface {
  name = 'first1658858217156';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /*  await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7444" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "user" (login, password) VALUES ('admin', 'admin')`,
    ); */
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /*  await queryRunner.query(`DROP TABLE "user"`); */
  }
}
