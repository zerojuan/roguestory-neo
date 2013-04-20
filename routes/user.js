var ValueMap = require("../rogueengine/valuemap");

exports.getHome = function(req,res){
	if(req.user){
		console.log('User is logged in');		
		return res.send({message: 'User is in!', user: req.user, valueMap: ValueMap});
	}else{
		console.log('User is not logged in ');
		return res.send(401, 'User is not logged in');
	}
}

exports.logout = function(req, res){
	req.logout();
	return res.send({
		message : 'Logged Out',
		alive : false
	});
}