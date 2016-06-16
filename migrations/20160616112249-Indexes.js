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
    CREATE INDEX channels_team_id_idx ON channels(team_id);
    CREATE INDEX channels_created_by_idx ON channels(created_by);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP INDEX channels_team_id_idx;
    DROP INDEX channels_created_by_idx;
  `);
};
