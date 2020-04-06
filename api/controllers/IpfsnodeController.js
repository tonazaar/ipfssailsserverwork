var _ = require('lodash');
const request = require('request');
const promise = require('promise');
const IPFS = require('ipfs');

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
getipfsconfig : async function(req, res, next){
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


