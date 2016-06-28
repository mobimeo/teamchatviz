#!/usr/bin/env node

/*
  Slack Viz
  Copyright (C) 2016 Moovel Group GmbH, Haupstaetter str. 149, 70188, Stuttgart, Germany hallo@moovel.com

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
  USA
*/

require('dotenv').config();
require('babel-core/register')({
  presets: ['es2015-node5', 'stage-3']
});

var db = require('../db').default;

Promise.all([
  db.none('TRUNCATE channels;'),
  db.none('TRUNCATE members;'),
  db.none('TRUNCATE users;'),
  db.none('TRUNCATE session;'),
  db.none('TRUNCATE membership;'),
  db.none('TRUNCATE reactions;'),
  db.none('TRUNCATE messages;'),
  db.none('TRUNCATE emojis;'),
]).then(() => process.exit(0));