import { DataTypes } from "sequelize";
import type { Migration } from "../utils/db.ts";

export const up: Migration = async ({
  context: QueryInterface,
}): Promise<void> => {
  await QueryInterface.createTable("corpus_collections", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  });

  await QueryInterface.createTable("corpora_in_corpus_collection", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    corpus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "corpora", key: "id" },
      onDelete: "CASCADE",
    },
    corpus_collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "corpus_collections", key: "id" },
      onDelete: "CASCADE",
    },
  });
};

export const down: Migration = async ({
  context: QueryInterface,
}): Promise<void> => {
  await QueryInterface.dropTable("corpus_collections", { cascade: true });
  await QueryInterface.dropTable("corpora_in_corpus_collection");
};
