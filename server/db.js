import PG from 'pg-promise';
import config from './config';
import promiseLib from 'bluebird';
import monitor from 'pg-monitor';

const options = { promiseLib };
const pgp = PG(options);

// do not convert timestamp to date
pgp.pg.types.setTypeParser(1114, function (str) {
  return str;
});

const db = pgp(config.dbUrl);

monitor.attach(options);
monitor.setTheme('matrix');

export default db;
export { pgp };