import { env } from "./config.ts";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(env.DATABASE_URL);

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
  } catch (e) {
    console.log("Failed to connect to DB:", e);
    // exit process?
  }
};
