import PG from 'pg-promise';
import config from './config';

const pgp = PG();

// do not convert timestamp to date
pgp.pg.types.setTypeParser(1114, str => {
  return str;
});

const db = pgp(config.dbUrl);

export default db;