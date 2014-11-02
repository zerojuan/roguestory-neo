var app = require('./app.js');


app.listen(process.env.PORT || 3030, function(err){
	if(err){
		console.log("An error occured ", err);
		return err;
	}
	console.log('Listening to port ' + (process.env.PORT || 3030));
});