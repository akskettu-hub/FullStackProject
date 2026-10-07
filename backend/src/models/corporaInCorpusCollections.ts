import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.ts";

class CorporaInCorpusCollectionModel extends Model {}
CorporaInCorpusCollectionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    corpus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: { model: "corpora", key: "id" },
    },
    corpus_collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: { model: "corpus_collections", key: "id" },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "CorporaInCorpusCollectionModel",
    tableName: "corpora_in_corpus_collection",
  },
);

export default CorporaInCorpusCollectionModel;
