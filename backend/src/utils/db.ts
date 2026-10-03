import { SequelizeStorage, Umzug } from "umzug";
import { env } from "./config.ts";
import { Sequelize } from "sequelize";

import path from "node:path";

export const sequelize = new Sequelize(env.DATABASE_URL);

export const migrator = new Umzug({
  migrations: {
    glob: path.join(import.meta.dirname, "../migrations/*.ts"),
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
});

export type Migration = typeof migrator._types.migration;

export const runMigrations = async (): Promise<void> => {
  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

export const rollbackMigration = async (): Promise<void> => {
  await sequelize.authenticate();
  const rollbacks = await migrator.down();
  console.log("Ran rollback", {
    files: rollbacks.map((rb) => rb.name),
  });
};

export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB");
    console.log("Connecting with:", {
      host: sequelize.config.host,
      port: sequelize.config.port,
      database: sequelize.config.database,
      username: sequelize.config.username,
    });
    await runMigrations();
  } catch (e) {
    console.log("Failed to connect to DB:", e);
    // exit process?
  }
};
