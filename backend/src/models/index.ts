import CollectionModel from "./collections.ts";
import CollectionTitleStatementModel from "./collectionTitleStatement.ts";
import CorpusModel from "./corpora.ts";
import UserModel from "./users.ts";

CollectionModel.hasMany(CollectionTitleStatementModel, {
  foreignKey: "collection_id",
  as: "titleStatements",
});

CollectionTitleStatementModel.belongsTo(CollectionModel, {
  foreignKey: "collection_id",
});

CorpusModel.hasMany(CollectionModel, {
  foreignKey: "in_corpus",
  as: "collections",
});

CollectionModel.belongsTo(CorpusModel, {
  foreignKey: "in_corpus",
});

export {
  CollectionModel,
  CollectionTitleStatementModel,
  UserModel,
  CorpusModel,
};
