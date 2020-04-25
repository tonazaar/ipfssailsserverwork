var _ = require('lodash');
const IPFS = require('ipfs');

userdefault = require("./ipfsusage/userdefault.json");

module.exports = {

joinnodecluster : async function(req, res, next){
  var result = await Ipfsusage.findOne({
        hash : req.body.hash
	    });
	res.json(result);

},
joinnodeprivate : async function(req, res, next){

},
joinnodepublic : async function(req, res, next){

},

getprivatenodes : async function(req, res, next){
  var recs = await Ipfsusage.find({userid: req.body.userid});
	res.json(recs);
},

getpublicnodes : async function(req, res, next){
  var recs = await Ipfsusage.find({userid: req.body.userid});
	res.json(recs);
},

getclusternodes : async function(req, res, next){
  var recs = await Ipfsusage.find({userid: req.body.userid});
	res.json(recs);
},


	/*
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
*/

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


