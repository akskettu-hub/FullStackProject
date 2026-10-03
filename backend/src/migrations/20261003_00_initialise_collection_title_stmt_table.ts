/* 
CREATE TABLE collection_title_statements(
  id SERIAL PRIMARY KEY,
  collection_id INT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  seq INT NOT NULL,
  text TEXT NOT NULL
);
 */

import { DataTypes } from "sequelize";
import type { Migration } from "../utils/db.ts";

export const up: Migration = async ({
  context: QueryInterface,
}): Promise<void> => {
  await QueryInterface.createTable("collection_title_statements", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "collections", key: "id" },
      onDelete: "CASCADE",
    },
    seq: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
};

export const down: Migration = async ({
  context: QueryInterface,
}): Promise<void> => {
  await QueryInterface.dropTable("collection_title_statements");
};
