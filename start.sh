

export MONGO_URI=mongodb://rogue-admin:testacool@dharma.mongohq.com:10023/rogue-neo
export REDIS_HOST=127.0.0.1
export REDIS_PORT=6379
export REDIS_PASS=testpass

ECHO Starting Game Server...
nodemon --debug server.js