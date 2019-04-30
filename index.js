const express = require('express');
const helmet = require('helmet');

const zooRouter = require('./zoo/zoo-router.js');
const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.use('/api/zoo', zooRouter);

const port = process.env.PORT || 8000;

server.listen(port, function() {
	console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
