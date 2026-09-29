import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.ts";

class Collection extends Model {}
Collection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    xml_id: {
      type: DataTypes.TEXT,
    },
    title_stmt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "Collection",
    tableName: "collections",
  },
);

export default Collection;
