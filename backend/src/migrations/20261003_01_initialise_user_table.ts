/*
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  restricted BOOLEAN DEFAULT FALSE
);
 */

import { DataTypes } from "sequelize";
import type { Migration } from "../utils/db.ts";

export const up: Migration = async ({
  context: QueryInterface,
}): Promise<void> => {
  await QueryInterface.createTable("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    restricted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

export const down: Migration = async ({
  context: QueryInterface,
}): Promise<void> => {
  await QueryInterface.dropTable("users");
};
