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
  return db.createTable('users', {
    id: { type: type.STRING, primaryKey: true },
    team_id: { type: type.STRING },
    profile: 'jsonb',
    created_at: type.TIMESTAMP,
    updated_at: type.TIMESTAMP,
    access_token: type.STRING,
  });
};

exports.down = function(db) {
  return db.dropTable('users');
};
