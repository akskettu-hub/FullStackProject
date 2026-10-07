import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.ts";

class CorpusCollectionModel extends Model {}
CorpusCollectionModel.init(
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
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "CorpusCollectionModel",
    tableName: "corpus_collections",
  },
);

export default CorpusCollectionModel;
