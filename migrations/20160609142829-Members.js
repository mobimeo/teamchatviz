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
  return db.createTable('members', {
    id: { type: type.STRING, primaryKey: true },
    team_id: { type: type.STRING },
    created_at: type.TIMESTAMP,
    updated_at: type.TIMESTAMP,
    name: type.STRING,
    color: type.STRING,
    first_name: type.STRING,
    last_name: type.STRING,
    real_name: type.STRING,
    skype: type.STRING,
    email: type.STRING,
    phone: type.STRING,
    image24: type.STRING,
    image32: type.STRING,
    image48: type.STRING,
    image72: type.STRING,
    image192: type.STRING,
  });
};

exports.down = function(db) {
  return db.dropTable('members');
};

