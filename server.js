var application_root = __dirname,
	qs = require("querystring"),
	express =  require("express"),
	request = require("request"),	
	less = require("less-middleware"),	
	mongoose = require('mongoose'),
	fs = require("fs");

var RedisStore = require("connect-redis")(express);

var GameRoute = require("./routes/game");
var UserRoute = require("./routes/user");

var User = require("./models/user");

var passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy;

var options = {
	server : {poolSize: 5}
};
options.server.socketOptions = {keepAlive: 1};
var db = mongoose.connect(process.env.MONGO_URI, options);

passport.use(new LocalStrategy(
  function(username, password, done) {
  	console.log('Authenticating', username, password);

  	User.findOne({username: username}, function(err, user){
  		if(err){
  			console.log("Error Here:");
  			return done(null, false, {message: err.message});
  		}
  		if(!user){
  			return done(null, false, {message : 'Username not found'});
  		}
  		if(password != user.password){
  			return done(null, false, {message : 'Incorrect password'});
  		}

  		return done(null, user);
  	});   
  }
));

passport.serializeUser(function(user, done){	
	done(null, user._id);
});

passport.deserializeUser(function(id, done){	
	User.findById(id, function(err, user){
		return done(err, user);
	});			
});

var app = express();

var root = (app.settings.env == 'production') ? '/client-prod' : '/app';

app.configure(function(){
	app.use(less({
		src : __dirname + root,
		compress : true
	}));	
	app.use(express.bodyParser());
	app.use(express.cookieParser());	
	app.use(express.session({ store: new RedisStore({
		host : process.env.REDIS_HOST,
		port : process.env.REDIS_PORT,
		pass : process.env.REDIS_PASS
	}), secret: 'super secret key' }));
	app.use(passport.initialize());
  	app.use(passport.session());
  	app.use(express.methodOverride());
	app.use(app.router);	
	app.use(express.static(__dirname+root));
	app.use(express.errorHandler({dumpException : true, showStack : true}));
	app.use(function(err, req, res, next){
		console.log(err.stack);
		res.send(500, 'Something broke!');
	});
});

//SETUP API
var packageJSON = JSON.parse(fs.readFileSync(__dirname + '/package.json'));

app.get('/', function(req, res, next){	
	fs.readFile(__dirname+root+'/index.html', 'utf8', function(err, file) {		
	    if (err) {
	      res.send(500);
	      return next();
	    }	    

	    res.writeHead(200, {'Content-Type' : 'text/html'});
	    file = file.replace(/%VERSION%/g, packageJSON.version);	    
	    res.end(file);	    
	});
});

app.post('/auth/login', function(req, res, next){
	passport.authenticate('local', function(err, user, info){
		if(err){ console.log('Error Occured'); return next(err); }
		if(!user) { return res.send({error: true, message: info.message})};
		req.logIn(user, function(err){
			if(err){return next(err);}
			return res.send({
				message : 'Logged In',
				alive : true,
				user : user
			});	
		});		
	})(req, res,next);	
});

app.get('/secret', passport.authenticate('local'), function(req, res){
	if(req.user){
		console.log('User is logged in');
		return res.send({message: 'You have the secret'});
	}
});


app.get('/home', UserRoute.getHome);

app.get('/dungeon', GameRoute.getDungeon);

app.post('/auth/logout', UserRoute.logout);

app.listen(process.env.PORT || 3030, function(err){
	if(err){
		console.log("An error occured ", err);
		return err;
	}
	console.log('Listening to port ' + (process.env.PORT || 3030));
});