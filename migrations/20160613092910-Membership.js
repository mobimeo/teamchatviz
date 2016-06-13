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
  return db.createTable('membership', {
    team_id: type.STRING,
    channel_id: type.STRING,
    user_id: type.STRING,
    is_member: 'bool',
  });
};

exports.down = function(db) {
  return db.dropTable('membership');
};

