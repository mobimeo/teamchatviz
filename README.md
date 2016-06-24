# Slack Visualization Tool

Slack Viz enables you to explore how your Slack team works:

 - channel heartbeat
 - people land
 - channel land
 - frequent speakers
 - messages & reactions
 - emoji timeline

Client app is built with [React](https://facebook.github.io/react/) and [JSPM](http://jspm.io/). Vizualisations leverage [react-vis](https://github.com/uber/react-vis) and [d3](https://d3js.org/). Server is written in ES6+ using [Koa 2](https://github.com/koajs/koa) and [Babel](https://babeljs.io/). PostgreSQL is used a database with the help of [pg-promise](https://www.npmjs.com/package/pg-promise).

See the full list of dependencies in the [client's package.json](package.json) and [server's package.json](client/package.json).

## Dependencies

1. node@4.4.3
2. npm@latest (`npm install npm -g`)
3. jspm@beta (`npm install jspm@beta -g`)

## Development setup

1. `git clone git@github.com:moovel/slack_viz.git` and `cd slack_viz`
2. `npm install`
3. `cd client`
4. `npm install`
5. `jspm install`
6. `cd ..`
7. `npm start`
8.  Open http://localhost:3333 in your browser

## LICENSE

[LGPLv2.1](LICENSE)
