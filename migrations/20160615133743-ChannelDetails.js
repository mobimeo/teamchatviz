'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db
    .addColumn('channels', 'creation_date', 'TIMESTAMP')
    .then(() => db.addColumn('channels', 'created_by', type.STRING));
};

exports.down = function(db) {
  return db
    .removeColumn('channels', 'creation_date')
    .then(() => db.removeColumn('channels', 'created_by'));
};
