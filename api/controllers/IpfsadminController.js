var _ = require('lodash');
const IPFS = require('ipfs');
userdefault = require("./ipfsusage/userdefault.json");


module.exports = {

getfile : async function(req, res, next){
  var result = await Ipfsusage.findOne({
        hash : req.body.hash
	    });
	res.json(result);

},

createuserconfig : async function(req, res, next){

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }

   var useripfsconfig = {
      userid: user.userid,
      nodetype: userdefault.nodetype,
      basepath : userdefault.basepath,
      usagelimit: userdefault.usagelimit,
      ipaddress: userdefault.ipaddress,
      publicgateway: userdefault.publicgateway,
      localgateway: userdefault.localgateway,   
      config: userdefault.xconfig
     };

  var newrec = await Userconfig.create({
        email : user.email,
        userid : user.userid,   
        username : user.username,
        usagelimit : userdefault.usagelimit,
	useripfsconfig: useripfsconfig,
         } ).fetch();

        res.json(newrec);


},

updateuserconfig : async function(req, res, next){

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }

   var useripfsconfig = {
      userid: user.userid,
      nodetype: userdefault.nodetype,
      basepath : userdefault.basepath,
      usagelimit: userdefault.usagelimit,
      ipaddress: userdefault.ipaddress,
      publicgateway: userdefault.publicgateway,
      localgateway: userdefault.localgateway,
      config: userdefault.xconfig
     };
  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

  var newrec = await Userconfig.update({
	id: tmpuserconfig.id}).set({
        usagelimit : userdefault.usagelimit,
        useripfsconfig: useripfsconfig,
         } ).fetch();

        res.json(newrec);

},


checkpinning : async function(req, res, next){

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


