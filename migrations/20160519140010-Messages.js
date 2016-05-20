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
  return db.createTable('messages', {
    id: { type: type.STRING, primaryKey: true },
    team_id: { type: type.STRING },
    user_id: { type: type.STRING },
    created_at: type.TIMESTAMP,
    updated_at: type.TIMESTAMP,
    message_ts: type.TIMESTAMP,
    type: type.STRING,
    text: type.STRING,
    is_starred: type.INTEGER,
    channel_id: type.STRING,
    reactions: 'jsonb',
  });
};

exports.down = function(db) {
  return db.dropTable('messages');
};

