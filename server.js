var application_root = __dirname,
	qs = require("querystring"),
	express =  require("express"),
	request = require("request"),
	less = require("less-middleware"),	
	fs = require("fs");

var passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy;

var localUsers = [
	{id: 1, username: 'Julius', password: 'testacool'},
	{id: 2, username: 'Albert', password: 'testacool1'},
	{id: 3, username: 'Tester', password: 'tester'}
];

passport.use(new LocalStrategy(
  function(username, password, done) {
  	console.log('Authenticating', username, password);
  	var user = null;
  	for(var i in localUsers){
  		if(username == localUsers[i].username){
  			user = localUsers[i];
  		}
  	}

  	if(!user){
  		return done(null, false, {message : 'Username not found'});
  	}

  	if(username != user.username){
  		return done(null, false, { message : 'Incorrect username.'});
  	}

  	if(password != user.password){
  		return done(null, false, { message : 'Incorrect password.'});
  	}
  	return done(null, user);    
  }
));

passport.serializeUser(function(user, done){
	console.log('Serializing User: ' + user.id);
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	console.log('Deserializing User: ', id);
	var user = null;
	for(var i in localUsers){
  		if(id == localUsers[i].id){
  			user = localUsers[i];
  			return done(null, user);
  		}
  	}	
	
	return done(null, id);
});

var app = express();

app.configure(function(){
	app.use(express.static(__dirname+"/app"));
	app.use(express.errorHandler({dumpException : true, showStack : true}));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(passport.initialize());
  	app.use(passport.session());
  	app.use(express.methodOverride());
	app.use(app.router);
	app.use(less({
		src : __dirname + '/app',
		compress : true
	}));
	
});

//SETUP API
app.post('/auth/login', passport.authenticate('local'), function(req, res){
	return res.send({
		message : 'Logged In',
		alive : true
	});
});

app.get('/secret', passport.authenticate('local'), function(req, res){
	if(req.user){
		console.log('User is logged in');
		return res.send({message: 'You have the secret'});
	}
});

app.get('/home', function(req,res){
	if(req.user){
		console.log('User is logged in');
		return res.send({message: 'User is in!', user: req.user});
	}else{
		return res.send(401);
	}
});

app.post('/auth/logout', function(req, res){
	req.logout();
	return res.send({
		message : 'Logged Out',
		alive : false
	});
});

app.listen(process.env.PORT || 3002);
console.log('Listening to port 3002');