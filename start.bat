@ECHO OFF

set MONGO_URI=mongodb://nodejitsu:9597cbdebbb9040d11d73c71abe6676a@alex.mongohq.com:10048/nodejitsudb8062785619
set REDIS_HOST=127.0.0.1
set REDIS_PORT=6379
set REDIS_PASS=testpass

ECHO Starting Game Server...
node server.js