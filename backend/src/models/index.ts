import Collection from "./collections.ts";
import CollectionTitleStatement from "./collectionTitleStatement.ts";

Collection.hasMany(CollectionTitleStatement, {
  foreignKey: "collection_id",
  as: "titleStatements",
});

CollectionTitleStatement.belongsTo(Collection, {
  foreignKey: "collection_id",
});

export { Collection, CollectionTitleStatement };
