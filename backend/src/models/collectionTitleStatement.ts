import { sequelize } from "../utils/db.ts";
import { DataTypes, Model } from "sequelize";

class CollectionTitleStatementModel extends Model {}
CollectionTitleStatementModel.init(
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
    seq: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "CollectionTitleStatementModel",
    tableName: "collection_title_statements",
  },
);

export default CollectionTitleStatementModel;
