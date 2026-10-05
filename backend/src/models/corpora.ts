import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.ts";

class CorpusModel extends Model {}
CorpusModel.init(
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
    modelName: "CorpusModel",
    tableName: "corpora",
  },
);

export default CorpusModel;
