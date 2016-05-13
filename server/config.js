'use strict';

export default {
  slackClientId: process.env.SLACK_CLIENT_ID || null,
  slackClientSecret: process.env.SLACK_CLIENT_SECRET || null,
  dbUrl: process.env.DATABASE_URL || null,
};