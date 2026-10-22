import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.ts";

class LetterModel extends Model {}
LetterModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    xml_id: {
      type: DataTypes.TEXT, // TODO: this should not allow null. Fix with migration
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
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "LetterModel",
    tableName: "documents",
  },
);

export default LetterModel;
