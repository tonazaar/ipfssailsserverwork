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

getipfsconfig : async function(req, res, next){

/*
	  var basepath = '';
        var ipaddress = '157.245.63.46';
        var nodetype;

        var config1 = {
"Addresses": {
    "Swarm": [
      "/ip4/157.245.63.46/tcp/6002",
      "/ip4/157.245.63.46/tcp/6003/ws"
    ],
    "API": "/ip4/157.245.63.46/tcp/5001",
    "Gateway": "/ip4/157.245.63.46/tcp/9090",
    "Delegates": []
  }

};

        var config2 = {
         "Addresses": {
    "Swarm": [
      "/ip4/0.0.0.0/tcp/7002",
      "/ip4/127.0.0.1/tcp/4003/ws"
    ],
    "API": "/ip4/127.0.0.1/tcp/5002",
    "Gateway": "/ip4/0.0.0.0/tcp/9001",
    "Delegates": []
  }
    };

  nodetype = req.body.nodetype;
  var userid = req.body.userid;

 if(req.body.nodetype == 'clusternode') {
     basepath = '/cluster'+req.body.userid;
  }else if(req.body.nodetype == 'privatesharednode') {
     basepath = '/privateshared'+req.body.userid;
  }else if(req.body.nodetype == 'publicsharednode') {
     basepath = '/publicshared'+req.body.userid;
  }else {
     basepath = '/private'+req.body.userid;
          nodetype = 'privatenode';
  }

  var ipfsconfig = {
      userid: userid,
      nodetype: nodetype,
      basepath : basepath,
      usagelimit: userdefault.usagelimit,
      ipaddress: ipaddress,
      publicgateway: 'https://ipfs.io',
      localgateway: 'http://157.245.63.46:9090',
      config: config1
  };
*/
  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

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


