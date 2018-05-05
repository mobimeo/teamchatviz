&#35;teamchatviz
==============

by [moovel lab](http://lab.moovel.com) and [moovel dev team](https://moovel.com)

![](/demo.gif)

&#35;teamchatviz enables you to explore how your [Slack](https://slack.com/) team works:

 - channel heartbeat
 - people land
 - channel land
 - frequent speakers
 - messages & reactions
 - emoji timeline

Client app is built with [React](https://facebook.github.io/react/) and [JSPM](http://jspm.io/). Visualisations leverage [react-vis](https://github.com/uber/react-vis) and [d3](https://d3js.org/). Server is written in ES6+ using [Koa 2](https://github.com/koajs/koa) and [Babel](https://babeljs.io/). PostgreSQL is used a database with the help of [pg-promise](https://www.npmjs.com/package/pg-promise).

Nota bene: &#35;teamchatviz is not created by, affiliated with, or supported by Slack Technologies, Inc. Please comply with your applicable data protection and labour law regulations when using our tool.

Project Page
------------
See the project page [moovel.github.io/teamchatviz](http://moovel.github.io/teamchatviz/) for more infos, screenshots and a screenrecording.

Online Demo
-----------
Online demo app under [teamchatviz-demo.moovel.com](https://teamchatviz-demo.moovel.com/) (with fake Slack team data, generated with Faker.js). 

Currently supported browsers: latest Chrome/Chromium, Firefox or Safari. 

Running your own instance of &#35;teamchatviz App
-----------------------------
1. Go to [api.slack.com/apps/new](https://api.slack.com/apps/new) and create a new app. Go to the `App Credentials` tab of the newly created app to get client id and client secret. Specify the following Redirect URI for your Slack App: `http://<hostname of your server>/api/auth/slack/callback`
2. Create a Heroku instance of &#35;teamchatviz using the `Deploy to Heroku` button below. Specify the choosen hostname, client id and client secret during the creation of the Heroku instance.
3. Navigate to `http://<hostname of your server>` and press `Add to Slack` button. Grant all required permissions to the Slack app that you created on step #1. 
4. The data about your team will be loaded in the background and the visualizations will be available soon.

Run on Heroku
-------------

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/moovel/teamchatviz/tree/master)

Never heard of Heroku? Here's how to install it: [https://youtu.be/8lzdCWoiDbY](https://youtu.be/8lzdCWoiDbY)

Run with Docker
-------------
See [docker image](https://hub.docker.com/r/xqua/teamchatviz/) by [Xqua](https://github.com/Xqua)

Development Setup
-----------------

You need a recent Node JS version (4+) installed and JSPM 0.17 Beta (`npm install jspm@beta -g`).

1. `git clone git@github.com:moovel/teamchatviz.git` and `cd teamchatviz`.
2. `npm install` - install server npm dependencies.
3. `cd client && npm install && jspm install` - install client dependencies.
4. `cd ..`.
5. Create `.env` file with the following content:

  ```
  PORT=3333
  SLACK_CLIENT_ID="<client id of your slack app>"
  SLACK_CLIENT_SECRET="<slack app secret>"
  DATABASE_URL="<postgresql database URL e.g. postgres://teamchatviz:teamchatviz@localhost/teamchatviz>"
  PUBLIC="false"
  ANONYMIZE="false"
  SESSION_SECRET="secret"
  ```
  
  If PUBLIC === true the data loaded into the system will be public and will not require authentication via Slack. If ANONYMIZE === true the data loaded into the system will be replaced with the fake data using `Faker.js`. Anonymization will happen only on the initial data loading and before the data reaches the database.
  
  If PUBLIC === true, `Add to Slack` button on the Main page is hidden and login is disabled. If you change the PUBLIC setting for an existing instance, the changes will apply only after a restart of the server. 

6. Create database as described in the next section and apply database migration by running `npm run up`.
7. `npm start` - start the server.
8.  Open `http://localhost:$PORT` in your browser.

Create a PostgreSQL database
-------

In order to create a database in PostgreSQL you need to start `psql` client. On Linux systems you can run `sudo -u postgres psql` for this. On OS X you can start it [via the UI of Postgres.app](https://cloud.githubusercontent.com/assets/2119400/17279216/c6df3120-5723-11e6-961d-d6ed26d5b35e.png).

Then you may run the following commands to create a user called `teamchatviz` with the password `teamchatviz` and a database called `teamchatviz`:

```sh
CREATE DATABASE teamchatviz;
CREATE ROLE teamchatviz WITH LOGIN CREATEDB PASSWORD 'teamchatviz';
ALTER USER teamchatviz VALID UNTIL 'infinity';
ALTER DATABASE teamchatviz OWNER TO teamchatviz;
GRANT ALL ON DATABASE teamchatviz TO teamchatviz;
\c teamchatviz
ALTER SCHEMA public OWNER TO teamchatviz;
```

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
* Open source font "Source Sans Pro" [source-sans-pro](https://github.com/adobe-fonts/source-sans-pro)

See the full list of dependencies in the [client's package.json](package.json) and [server's package.json](client/package.json).

LICENSE
-------

[LGPLv2.1](LICENSE)
