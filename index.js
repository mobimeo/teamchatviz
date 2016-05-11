require('babel-core/register')({
  presets: ['es2015-node5', 'stage-3']
});

const app = require('./server').default;
app.listen(3333);