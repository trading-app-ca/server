const app = require('../serverConfig');
const http = require('http');

const server = http.createServer(app);

module.exports = server;