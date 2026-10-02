import Collection from "./collections.ts";
import CollectionTitleStatement from "./collectionTitleStatement.ts";
import User from "./users.ts";

Collection.hasMany(CollectionTitleStatement, {
  foreignKey: "collection_id",
  as: "titleStatements",
});

CollectionTitleStatement.belongsTo(Collection, {
  foreignKey: "collection_id",
});

export { Collection, CollectionTitleStatement, User };
