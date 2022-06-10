#!/usr/bin/env node
/* eslint-disable global-require */
const isDev = process.env.NODE_ENV === 'development';

if (isDev) require('../src/entry');
else require('../dist/src/entry');
