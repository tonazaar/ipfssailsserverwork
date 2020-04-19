var _ = require('lodash');
const IPFS = require('ipfs');

ipfstoken = require('./ipfstokenmap/slpipfs.json');

  console.log(ipfstoken.usagemultiplier);
module.exports = {

getfile : async function(req, res, next){
  var result = await Ipfsusage.findOne({
        hash : req.body.hash
	    });
	res.json(result);

},

gettokenbalance : async function(req, res, next){
  console.log(ipfstoken.usagemultiplier);
  var sendstatus = 0;
  sendstatus = await SlptokenService.getTestTokenBalance();
	console.log(sendstatus);
  res.json(sendstatus);
},

updateearnedtokens : async function(req, res, next){
  console.log(ipfstoken.usagemultiplier);
  var sendstatus = 0;

  var userwallet = await Userwallet.findOne({userid: req.body.userid, tokenid: ipfstoken.TOKENID});
  var touserwallet = await Userwallet.findOne({userid: req.body.touserid, tokenid: ipfstoken.TOKENID});
  var toamount = req.body.toamount;

  console.log(ipfstoken.usagemultiplier);

  var sendstatus = SlptokenService.sendToken(userwallet.slpwallet, touserwallet.toaddress, toamount);
  res.json(sendstatus);

},

redeemToken : async function(req, res, next){
  console.log(ipfstoken.usagemultiplier);
  var sendstatus = 0;

  var userwallet = await Userwallet.findOne({userid: req.body.userid, tokenid: ipfstoken.TOKENID});
  var touserwallet = await Userwallet.findOne({userid: req.body.touserid, tokenid: ipfstoken.TOKENID});
  var toamount = req.body.toamount;

  console.log(ipfstoken.usagemultiplier);

  var sendstatus = SlptokenService.sendToken(userwallet.slpwallet, touserwallet.toaddress, toamount);
  
  res.json(sendstatus);

},



sendtoken : async function(req, res, next){
  console.log(ipfstoken.usagemultiplier);
  var sendstatus = 0;

  var userwallet = await Userwallet.findOne({userid: req.body.userid, tokenid: ipfstoken.TOKENID});
  var touserwallet = await Userwallet.findOne({userid: req.body.touserid, tokenid: ipfstoken.TOKENID});
  var toamount = req.body.toamount;

  console.log(ipfstoken.usagemultiplier);

  var sendstatus = SlptokenService.sendToken(userwallet.slpwallet, touserwallet.toaddress, toamount);
  res.json(sendstatus);
  
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

createwallet : async function(req, res, next){

  var slpwallet = SlptokenService.createwallet();
  var newrec = await Userwallet.create({
        slpwallet : slpwallet,
	   tokenid: ipfstoken.TOKENID,
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


