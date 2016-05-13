require('dotenv').config();
require('babel-core/register')({
  presets: ['es2015-node5', 'stage-3']
});

const app = require('./server').default;
const pgStore = require('./server/pg-store');
pgStore.setup().then(() => app.listen(3333));