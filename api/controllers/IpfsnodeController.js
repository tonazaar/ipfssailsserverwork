var _ = require('lodash');
const request = require('request');
const promise = require('promise');
const IPFS = require('ipfs');

userdefault = require("./ipfsusage/userdefault.json");


module.exports = {

startnode : async function(req, res, next){

   var username = req.body.userid;

   startnode(username).then(xx=> {
	console.log("Message = "+xx);	
	   res.json(xx)
   }).catch(err=>{
	console.log("Error="+ err);	
	   res.json(err)
   });

},
stopnode : async function(req, res, next){
   var username = req.body.userid;
   stopnode(username).then(xx=> {
	console.log("Message = "+xx);	
	   res.json(xx)
   }).catch(err=>{
	console.log("Error="+ err);	
	   res.json(err)
   });

},

getgroupipfsconfig : async function(req, res, next){

  if(!req.body.groupid) {
    ResponseService.json(403, res, "No groupid provided ");
          return;
  }
  if(!req.body.usertype) {
    ResponseService.json(403, res, "No usertype provided ");
          return;
  }

  var tmpuserconfig = await Usergroupconfig.findOne({groupid: req.body.groupid, usertype: req.body.usertype} );

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }


  res.json(tmpuserconfig.groupipfsconfig);

},

oldgetipfsconfig : async function(req, res, next){

  if(!req.body.userid) {
    ResponseService.json(403, res, "No userid provided ");
          return;
  }
  if(!req.body.usertype) {
    ResponseService.json(403, res, "No usertype provided ");
          return;
  }

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid, usertype: req.body.usertype} );

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }


  res.json(tmpuserconfig.useripfsconfig);

},

getnodestatus : async function(req, res, next){
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




function startnode (user)
{
var url = 'http://localhost:8080/startnode/';
var promise = new Promise(function (resolve, reject) {

    request.get(url + user , function (error, response, body) {
        if (error) {
           reject(error);
        }
       resolve(body);
    });
  });

  return promise;
}

function stopnode (user)
{
var url = 'http://localhost:8080/stopnode/';
var promise = new Promise(function (resolve, reject) {

    request.get(url + user , function (error, response, body) {
        if (error) {
           reject(error);
        }
       resolve(body);
    });
  });

  return promise;
}


