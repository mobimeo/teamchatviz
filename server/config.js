/*
  #viz4slack
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

import logger from 'winston';

logger.emitErrs = true;
logger.level = process.env.LOG_LEVEL || 'info';

const cfg = {
  slackClientId: process.env.SLACK_CLIENT_ID || null,
  slackClientSecret: process.env.SLACK_CLIENT_SECRET || null,
  dbUrl: process.env.DATABASE_URL || null,
  anonymize: process.env.ANONYMIZE === 'true',
  public: process.env.PUBLIC === 'true',
  logQueries: process.env.LOG_QUERIES === 'true',
  logLevel: logger.level,
  viz: {
    tSNEIterations: process.env.VIZ_TSNE_ITERATION || 500,
  }
};

logger.info('Started with the following params', cfg);

export default cfg;