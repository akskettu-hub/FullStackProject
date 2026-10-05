import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.ts";

class CollectionModel extends Model {}
CollectionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    xml_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    in_corpus: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "CollectionModel",
    tableName: "collections",
  },
);

export default CollectionModel;
