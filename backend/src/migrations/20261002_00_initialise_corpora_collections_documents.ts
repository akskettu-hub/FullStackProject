/*
CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    xml_id TEXT UNIQUE NOT NULL,
    title_stmt TEXT
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    collection_id INT REFERENCES collections(id),
    xml_id TEXT,
    title_key TEXT,
    author_key TEXT,
    text_type TEXT,
    lang TEXT,
    raw_xml TEXT NOT NULL,
    parsed_fields JSONB DEFAULT '{}'
);


ALTER TABLE documents
  ADD COLUMN authenticity TEXT,
  ADD COLUMN year INT,
  ADD COLUMN year_raw TEXT,
  ADD COLUMN year_is_decade_suggestion BOOLEAN DEFAULT FALSE,
  ADD COLUMN year_is_uncertain BOOLEAN DEFAULT FALSE,
  ADD COLUMN relationship_code TEXT,
  ADD COLUMN correspondent_code TEXT,
  ADD COLUMN title_key_parse_ok BOOLEAN DEFAULT FALSE;
 */

import { DataTypes } from "sequelize";
import type { Migration } from "../utils/db.ts";

export const up: Migration = async ({
  context: QueryInterface,
}): Promise<void> => {
  await QueryInterface.createTable("collections", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    xml_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  await QueryInterface.createTable("documents", {
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
    xml_id: {
      type: DataTypes.TEXT,
    },
    title_key: {
      type: DataTypes.TEXT,
    },
    author_key: {
      type: DataTypes.TEXT,
    },
    text_type: {
      type: DataTypes.TEXT,
    },
    lang: {
      type: DataTypes.TEXT,
    },
    raw_xml: {
      type: DataTypes.TEXT,
    },
    parsed_fields: {
      type: DataTypes.JSONB,
      defaultValue: "{}",
    },
    authenticity: {
      type: DataTypes.TEXT,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    year_raw: {
      type: DataTypes.TEXT,
    },
    year_is_decade_suggestion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    year_is_uncertain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    relationship_code: {
      type: DataTypes.TEXT,
    },
    correspondent_code: {
      type: DataTypes.TEXT,
    },
    title_key_parse_ok: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

export const down: Migration = async ({
  context: QueryInterface,
}): Promise<void> => {
  await QueryInterface.dropTable("collections");
  await QueryInterface.dropTable("documents");
};
