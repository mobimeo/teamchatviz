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
  return db.runSql(`
    CREATE INDEX messages_date_message_ts_idx ON messages(DATE(message_ts));
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP INDEX messages_date_message_ts_idx;
  `);
};
