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

Nota bene: &#35;slackviz is not created by, affiliated with, or supported by Slack Technologies, Inc.

Project Page
------------
See the project page [moovel.github.io/slackviz](http://moovel.github.io/slackviz/) for more infos, screenshots and a screenrecording.

Online Demo
-----------
TODO big and bold Link to online demo. 

Create your &#35;slackviz App
-----------------------------
1. Create a Heroku instance of &#35;slackviz (use Deploy to Heroku button)
2. Go to [api.slack.com/apps/new](https://api.slack.com/apps/new) and create a new app. Go to the App Credentials tab of the newly created app to get client id and client secret. Specify the following Redirect URI for your Slack App: `http://<your hostname>:<port>/api/auth/slack/callback`
3. ... TODO

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
PORT=3333
SLACK_CLIENT_ID="<client id of your slack app>"
SLACK_CLIENT_SECRET="<slack app secret>"
DATABASE_URL="<postgresql database URL e.g. postgres://slackviz:slackviz@localhost/slackviz>"
PUBLIC="false"
ANONYMIZE="false"
```

If PUBLIC === true the data loaded into the system will be public and will not require authentication via Slack. If ANONYMIZE === true the data loaded into the system will be replaced with the fake data using Faker.js. Anonymization will happen only on the initial data loading and before the data reaches the database.

If PUBLIC === true, Add to Slack button on the Main page is hidden and login is disabled. If you change the PUBLIC setting for an existing instance, the changes will apply only after a restart of the server. 

6. Run db migrations `npm run up`

The database needs to be created first.

6. `npm start` - start the server
7.  Open `http://localhost:$PORT` in your browser


Testing
-------

```sh
npm test
```

Team
----
* Idea: Thorsten Heilig, [Eileen Mandir](http://lab.moovel.com/people/eileen-mandir), [Benedikt Groß](https://github.com/b-g/)
* Concept: [Benedikt Groß](https://github.com/b-g/), [Flore de Crombrugghe](http://lab.moovel.com/people/flore-de-crombrugghe), [Raphael Reimann](http://lab.moovel.com/people/raphael-reimann), [Tilman Häuser](http://lab.moovel.com/people/tilman-haeuser)
* Direction: [Benedikt Groß](https://github.com/b-g/)
* Visual Design: [Flore de Crombrugghe](http://lab.moovel.com/people/flore-de-crombrugghe)
* Frontend Development: [Alex Rudenko](https://github.com/OrKoN), [Tobias Lauer](https://github.com/TobiasLauer)
* Backend Development: [Alex Rudenko](https://github.com/OrKoN)
* Text and Editing: [Raphael Reimann](http://lab.moovel.com/people/raphael-reimann)
* Project Site: [Raphael Reimann](http://lab.moovel.com/people/raphael-reimann), Josefine Hartung, [Tobias Lauer](https://github.com/TobiasLauer)


Acknowledgement
---------------
* Client app is built with [React](https://facebook.github.io/react/) and [JSPM](http://jspm.io/) 
* Vizualisations leverage [react-vis](https://github.com/uber/react-vis) and [d3](https://d3js.org/)
* Server is written in ES6+ using [Koa 2](https://github.com/koajs/koa) and [Babel](https://babeljs.io/)
* PostgreSQL is used a database with the help of [pg-promise](https://www.npmjs.com/package/pg-promise)
* Fake data for online demo generated with [Faker.js](https://github.com/marak/Faker.js/)

See the full list of dependencies in the [client's package.json](package.json) and [server's package.json](client/package.json).

LICENSE
-------

[LGPLv2.1](LICENSE)
