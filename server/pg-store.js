import PgStore from 'koa-pg-session';
import config from './config';

module.exports = new PgStore(config.dbUrl);