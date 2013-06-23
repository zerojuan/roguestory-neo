@ECHO OFF

set MONGO_URI=mongodb://rogue-admin:testacool@dharma.mongohq.com:10023/rogue-neo
set REDIS_HOST=127.0.0.1
set REDIS_PORT=6379
set REDIS_PASS=testpass

ECHO Starting Game Server...
nodemon --debug server.js