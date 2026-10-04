import Collection from "./collections.ts";
import CollectionTitleStatement from "./collectionTitleStatement.ts";
import Corpus from "./corpora.ts";
import User from "./users.ts";

Collection.hasMany(CollectionTitleStatement, {
  foreignKey: "collection_id",
  as: "titleStatements",
});

CollectionTitleStatement.belongsTo(Collection, {
  foreignKey: "collection_id",
});

Corpus.hasMany(Collection, {
  foreignKey: "in_corpus",
  as: "collections",
});

Collection.belongsTo(Corpus, {
  foreignKey: "in_corpus",
});

export { Collection, CollectionTitleStatement, User, Corpus };
