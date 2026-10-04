import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.ts";

class Corpus extends Model {}
Corpus.init(
  {
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
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "Corpus",
    tableName: "corpora",
  },
);

export default Corpus;
