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
  return db.createTable('reactions', {
    id: { type: 'BIGSERIAL', primaryKey: true },
    team_id: type.STRING,
    channel_id: type.STRING,
    message_id: type.STRING,
    created_at: type.TIMESTAMP,
    updated_at: type.TIMESTAMP,
    name: type.STRING,
    count: type.INTEGER,
    message_ts: type.TIMESTAMP,
  });
};

exports.down = function(db) {
  return db.dropTable('reactions');
};

