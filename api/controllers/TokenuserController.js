var _ = require('lodash');
const IPFS = require('ipfs');

module.exports = {

getfile : async function(req, res, next){
  var result = await Ipfsusage.findOne({
        hash : req.body.hash
	    });
	res.json(result);

},

spendtoken : async function(req, res, next){

//	deduct token and update
//  var recs = await Tokenuser.find({userid: req.body.userid});
	//
},
getusage : async function(req, res, next){

},

listusers : async function(req, res, next){
  var users = await User.find({where: {userid:{'!=': ['']}}, select:['userid', 'username']});
  // var users = await User.find({where: {username: 'user1'}, select:['userid']});
	res.json(users);
},

listfiles : async function(req, res, next){
  var recs = await Ipfsusage.find({userid: req.body.userid});

	res.json(recs);
},

savefile : async function(req, res, next){

  var newrec = await Ipfsusage.create({
        path : req.body.path,
        name : req.body.name,
        hash : req.body.hash,
        cid : req.body.cid,
        userid: req.body.userid,
         } ).fetch();

	res.json(newrec);

},

deletefile : async function(req, res, next){
  var result = await Ipfsusage.remove({
        hash : req.body.hash
	    });
	res.json(result);

}

}

function generateToken(user_id) {
  return JwtService.issue({id: user_id})
};

function invalidEmailOrPassword(res){
  return ResponseService.json(401, res, "Invalid email or password")
};

function verifyParams(res, email, password){
  if (!email || !password) {
    return ResponseService.json(401, res, "Email and password required")
  }
};


