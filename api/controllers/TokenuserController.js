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

  if(!req.body.userid) {
    ResponseService.json(403, res, "Userid not specified  " );  return;
  }

  var userwallet = await Userwallet.findOne({userid: req.body.userid, tokenid: ipfstoken.TOKENID});
 if(!userwallet) {
ResponseService.json(403, res, "No user wallet for token-id :"+ipfstoken.TOKENID);
          return;
  }

	
  var sendstatus = 0;
  sendstatus = await SlptokenService.getTokenBalance(userwallet);
	console.log(sendstatus);
  res.json(sendstatus);
},

updateearnedtoken : async function(req, res, next){

  var sendstatus = 0;
  if(!req.body.usage || req.body.usage == 0) {
    ResponseService.json(200, res, "Nothing earned ");  return;

  }
  var toamount = req.body.usage * ipfstoken.usagemultiplier;

  if(req.body.userid != 'user1xxx') {
    ResponseService.json(403, res, "Only user1 can add amount : ");  return;

  }

  if(!(toamount || toamount > 0)) {
    ResponseService.json(403, res, "To amount specified not valid : "+ toamount );  return;

  }
  if(!req.body.userid) {
    ResponseService.json(403, res, "Userid not specified  " );  return;
  }

  if(!req.body.touserid) {
    ResponseService.json(403, res, "touserid not specified  " );  return;
  }

  if(req.body.userid == req.body.touserid) {
    ResponseService.json(403, res, "From and to userid same" );  return;
  }

  var userwallet = await Userwallet.findOne({userid: req.body.userid, tokenid: ipfstoken.TOKENID});
  var touserwallet = await Userwallet.findOne({userid: req.body.touserid, tokenid: ipfstoken.TOKENID});
  if(!userwallet) {
ResponseService.json(403, res, "No user wallet for token-id :"+ipfstoken.TOKENID);
	  return;
  }

  if(!touserwallet) {
    ResponseService.json(403, res, "No touser wallet for token-id :"+ipfstoken.TOKENID);
	  return;
  }

  if(ipfstoken.WALLETTYPE != userwallet.wallettype  || 
     ipfstoken.WALLETTYPE != touserwallet.wallettype ) {

    ResponseService.json(403, res, "Wallettype not matching :"+ipfstoken.WALLETTYPE);
    
  }

  var startinfo = {
	  fromuser: userwallet.userid,
	  touser: touserwallet.userid,
	  toamount: toamount
  };
	
  var tranrec = await Transaction.create({
        tokenid: ipfstoken.TOKENID,
        userid: req.body.userid,
        startinfo: startinfo,
        status: 'started',
	  }).fetch();

  console.log(ipfstoken.usagemultiplier);

  var sendstatus = await SlptokenService.sendToken(userwallet, touserwallet, toamount);
  var tranupdate;
  if(sendstatus.txid) {
  tranupdate = await Transaction.update({
                id: tranrec.id,
                }).set({
                transactionid: sendstatus.txid,
                status: 'ended',
                outcome: 'success'
    }).fetch();
  }else if (sendstatus.error) {
  tranupdate = await Transaction.update({
                id: tranrec.id,
                }).set({
                endinfo: sendstatus.error,
                status: 'ended',
                outcome: 'error'
    }).fetch();
  }
 
  console.log(JSON.stringify(tranupdate));
  res.json(sendstatus);
  
},

redeemtoken : async function(req, res, next){

  var sendstatus = 0;
  var toamount = req.body.toredeem;

  if(req.body.touserid != 'user1xxx') {
    ResponseService.json(403, res, "Only user1 can receive redeemed amount  : ");  return;

  }

  if(!(toamount || toamount > 0)) {
    ResponseService.json(403, res, "To amount specified not valid : "+ toamount );  return;

  }
  if(!req.body.fromuserid) {
    ResponseService.json(403, res, "Userid not specified  " );  return;
  }

  if(!req.body.touserid) {
    ResponseService.json(403, res, "touserid not specified  " );  return;
  }

  if(req.body.fromuserid == req.body.touserid) {
    ResponseService.json(403, res, "From and to userid same" );  return;
  }

  var userwallet = await Userwallet.findOne({userid: req.body.fromuserid, tokenid: ipfstoken.TOKENID});
  var touserwallet = await Userwallet.findOne({userid: req.body.touserid, tokenid: ipfstoken.TOKENID});
  if(!userwallet) {
ResponseService.json(403, res, "No user wallet for token-id :"+ipfstoken.TOKENID);
	  return;
  }

  if(!touserwallet) {
    ResponseService.json(403, res, "No touser wallet for token-id :"+ipfstoken.TOKENID);
	  return;
  }

  if(ipfstoken.WALLETTYPE != userwallet.wallettype  || 
     ipfstoken.WALLETTYPE != touserwallet.wallettype ) {

    ResponseService.json(403, res, "Wallettype not matching :"+ipfstoken.WALLETTYPE);
    
  }

  var startinfo = {
	  function: "redeemtoken",
	  fromuser: userwallet.userid,
	  touser: touserwallet.userid,
	  toamount: toamount
  };
	
  var tranrec = await Transaction.create({
        tokenid: ipfstoken.TOKENID,
        userid: req.body.fromuserid,
        startinfo: startinfo,
        status: 'started',
	  }).fetch();

  console.log(ipfstoken.usagemultiplier);

  var sendstatus = await SlptokenService.sendToken(userwallet, touserwallet, toamount);
  var tranupdate;
  if(sendstatus.txid) {
  tranupdate = await Transaction.update({
                id: tranrec.id,
                }).set({
                transactionid: sendstatus.txid,
                status: 'ended',
                outcome: 'success'
    }).fetch();
  }else if (sendstatus.error) {
  tranupdate = await Transaction.update({
                id: tranrec.id,
                }).set({
                endinfo: sendstatus.error,
                status: 'ended',
                outcome: 'error'
    }).fetch();
  }
 
  console.log(JSON.stringify(tranupdate));
  res.json(sendstatus);
  
},



sendtoken : async function(req, res, next){
  
  var sendstatus = 0;
  var toamount = req.body.toamount;


  if(!(toamount || toamount > 0)) {
    ResponseService.json(403, res, "To amount specified not valid : "+ toamount );  return;

  }
  if(!req.body.userid) {
    ResponseService.json(403, res, "Userid not specified  " );  return;
  }

  if(!req.body.touserid) {
    ResponseService.json(403, res, "touserid not specified  " );  return;
  }

  if(req.body.userid == req.body.touserid) {
    ResponseService.json(403, res, "From and to userid same" );  return;
  }

  var userwallet = await Userwallet.findOne({userid: req.body.userid, tokenid: ipfstoken.TOKENID});
  var touserwallet = await Userwallet.findOne({userid: req.body.touserid, tokenid: ipfstoken.TOKENID});
  if(!userwallet) {
ResponseService.json(403, res, "No user wallet for token-id :"+ipfstoken.TOKENID);
	  return;
  }

  if(!touserwallet) {
    ResponseService.json(403, res, "No touser wallet for token-id :"+ipfstoken.TOKENID);
	  return;
  }

  if(ipfstoken.WALLETTYPE != userwallet.wallettype  || 
     ipfstoken.WALLETTYPE != touserwallet.wallettype ) {

    ResponseService.json(403, res, "Wallettype not matching :"+ipfstoken.WALLETTYPE);
    
  }

  var startinfo = {
	  fromuser: userwallet.userid,
	  touser: touserwallet.userid,
	  toamount: toamount
  };
	
  var tranrec = await Transaction.create({
        tokenid: ipfstoken.TOKENID,
        userid: req.body.userid,
        startinfo: startinfo,
        status: 'started',
	  }).fetch();

  console.log(ipfstoken.usagemultiplier);

  var sendstatus = await SlptokenService.sendToken(userwallet, touserwallet, toamount);
  var tranupdate;
  if(sendstatus.txid) {
  tranupdate = await Transaction.update({
                id: tranrec.id,
                }).set({
                transactionid: sendstatus.txid,
                status: 'ended',
                outcome: 'success'
    }).fetch();
  }else if (sendstatus.error) {
  tranupdate = await Transaction.update({
                id: tranrec.id,
                }).set({
                endinfo: sendstatus.error,
                status: 'ended',
                outcome: 'error'
    }).fetch();
  }
 
  console.log(JSON.stringify(tranupdate));
  res.json(sendstatus);
},

tokentoadd : async function(req, res, next){
  var sendstatus = 0;
  var toamount = req.body.toamount;

  if(req.body.userid != 'user1xxx') {
    ResponseService.json(403, res, "Only user1 can add amount : ");  return;

  }

  if(!(toamount || toamount > 0)) {
    ResponseService.json(403, res, "To amount specified not valid : "+ toamount );  return;

  }
  if(!req.body.userid) {
    ResponseService.json(403, res, "Userid not specified  " );  return;
  }

  if(!req.body.touserid) {
    ResponseService.json(403, res, "touserid not specified  " );  return;
  }

  if(req.body.userid == req.body.touserid) {
    ResponseService.json(403, res, "From and to userid same" );  return;
  }

  var userwallet = await Userwallet.findOne({userid: req.body.userid, tokenid: ipfstoken.TOKENID});
  var touserwallet = await Userwallet.findOne({userid: req.body.touserid, tokenid: ipfstoken.TOKENID});
  if(!userwallet) {
ResponseService.json(403, res, "No user wallet for token-id :"+ipfstoken.TOKENID);
	  return;
  }

  if(!touserwallet) {
    ResponseService.json(403, res, "No touser wallet for token-id :"+ipfstoken.TOKENID);
	  return;
  }

  if(ipfstoken.WALLETTYPE != userwallet.wallettype  || 
     ipfstoken.WALLETTYPE != touserwallet.wallettype ) {

    ResponseService.json(403, res, "Wallettype not matching :"+ipfstoken.WALLETTYPE);
    
  }

  var startinfo = {
	  fromuser: userwallet.userid,
	  touser: touserwallet.userid,
	  toamount: toamount
  };
	
  var tranrec = await Transaction.create({
        tokenid: ipfstoken.TOKENID,
        userid: req.body.userid,
        startinfo: startinfo,
        status: 'started',
	  }).fetch();


  var sendstatus = await SlptokenService.sendToken(userwallet, touserwallet, toamount);
  var tranupdate;
  if(sendstatus.txid) {
  tranupdate = await Transaction.update({
                id: tranrec.id,
                }).set({
                transactionid: sendstatus.txid,
                status: 'ended',
                outcome: 'success'
    }).fetch();
  }else if (sendstatus.error) {
  tranupdate = await Transaction.update({
                id: tranrec.id,
                }).set({
                endinfo: sendstatus.error,
                status: 'ended',
                outcome: 'error'
    }).fetch();
  }
 
  console.log(JSON.stringify(tranupdate));
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

createuserwallet : async function(req, res, next){

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
	  return;
  }
  var userwallet = await Userwallet.findOne({userid: req.body.userid, tokenid: ipfstoken.TOKENID});
  if(userwallet) {
    ResponseService.json(403, res, "Wallet already exists ");
	  return;
  }

  if(ipfstoken.WALLETTYPE == 'BCHSLP') {
  var slpwallet = SlptokenService.createuserwallet(user);
  var newrec = await Userwallet.create({
        slpwallet : slpwallet,
        tokenid: ipfstoken.TOKENID,
        email: user.email,
        username: user.username,
        slpderivepath: slpwallet.derivePath,
        wallettype: ipfstoken.WALLETTYPE,
        userid: user.userid,
         } ).fetch();

	res.json(newrec);
  }

},


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


