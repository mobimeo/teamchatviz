&#35;slackviz
==============

by [moovel lab](http://lab.moovel.com) and [moovel dev team](https://developers.moovel.com)

&#35;slackviz enables you to explore how your [Slack](https://slack.com/) team works:

 - channel heartbeat
 - people land
 - channel land
 - frequent speakers
 - messages & reactions
 - emoji timeline

Client app is built with [React](https://facebook.github.io/react/) and [JSPM](http://jspm.io/). Vizualisations leverage [react-vis](https://github.com/uber/react-vis) and [d3](https://d3js.org/). Server is written in ES6+ using [Koa 2](https://github.com/koajs/koa) and [Babel](https://babeljs.io/). PostgreSQL is used a database with the help of [pg-promise](https://www.npmjs.com/package/pg-promise).

See the full list of dependencies in the [client's package.json](package.json) and [server's package.json](client/package.json).

Project Page
------------
See the project page [moovel.github.io/slackviz](http://moovel.github.io/slackviz/) for more infos.


Run on Heroku
-------------

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/moovel/slackviz/tree/master)

Development Setup
-----------------

You need a recent Node JS version (4+) installed and JSPM 0.17 Beta (`npm install jspm@beta -g`).

1. `git clone git@github.com:moovel/slackviz.git` and `cd slackviz`
2. `npm install` - install server npm dependencies
3. `cd client && npm install && jspm install` - install client dependencies
4. `cd ..`
5. Create `.env` file with the following content:

```
PORT=3333 # port for the server
SLACK_CLIENT_ID="<client id of your slack app>"
SLACK_CLIENT_SECRET="<slack app secret>"
DATABASE_URL="<postgresql database URL e.g. postgres://slackviz:slackviz@localhost/slackviz>"
```

6. Run db migrations `npm run up`

The database needs to be created first.

6. `npm start` - start the server
7.  Open http://localhost:$PORT in your browser

Creating a Slack app
--------------------

Go to https://api.slack.com/apps/new and create a new app. Go to the App Credentials tab of the newly created app to get client id and client secret.

Testing
-------

```sh
npm test
```

Roadmap
-------

High-levels goals of the project:

- improve performance
- develop better visualizations
- make the client responsive

LICENSE
-------

[LGPLv2.1](LICENSE)
