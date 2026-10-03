import { DataTypes } from "sequelize";
import type { Migration } from "../utils/db.ts";

export const up: Migration = async ({
  context: QueryInterface,
}): Promise<void> => {
  await QueryInterface.createTable("corpora", {
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
    imported: {
      type: DataTypes.DATE,
    },
  });

  await QueryInterface.addColumn("collections", "in_corpus", {
    type: DataTypes.INTEGER,
    //allowNull: false, NOTE: A Collection should always belong to a corpus but
    // this is left off for testing
    // as existing rows do not have this data yet
    // TODO: Uncomment this once corpus import handles accociating collections to corpora
    // or handle it in a later migration
    references: { model: "corpora", key: "id" },
    onDelete: "CASCADE",
  });
};

export const down: Migration = async ({
  context: QueryInterface,
}): Promise<void> => {
  await QueryInterface.dropTable("corpora", { cascade: true });
  await QueryInterface.removeColumn("collections", "in_corpus");
};
