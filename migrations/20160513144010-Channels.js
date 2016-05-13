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
  return db.createTable('channels', {
    id: { type: type.STRING, primaryKey: true },
    team_id: { type: type.STRING },
    name: { type: type.STRING },
    created_at: type.TIMESTAMP,
    updated_at: type.TIMESTAMP,
    number_of_members: type.INTEGER,
    topic: 'jsonb',
    purpose: 'jsonb',
  });
};

exports.down = function(db) {
  return db.dropTable('channels');
};
