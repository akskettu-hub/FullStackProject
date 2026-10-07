import CollectionModel from "./collections.ts";
import CollectionTitleStatementModel from "./collectionTitleStatement.ts";
import CorpusModel from "./corpora.ts";
import CorporaInCorpusCollectionModel from "./corporaInCorpusCollections.ts";
import CorpusCollectionModel from "./corpusCollections.ts";
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

CorpusCollectionModel.belongsToMany(CorpusModel, {
  through: CorporaInCorpusCollectionModel,
  foreignKey: "corpus_collection_id",
  otherKey: "corpus_id",
  as: "corpora",
});
CorpusModel.belongsToMany(CorpusCollectionModel, {
  through: CorporaInCorpusCollectionModel,
  foreignKey: "corpus_id",
  otherKey: "corpus_collection_id",
  as: "corpus_collections",
});

export {
  CollectionModel,
  CollectionTitleStatementModel,
  UserModel,
  CorpusModel,
  CorpusCollectionModel,
  CorporaInCorpusCollectionModel,
};
