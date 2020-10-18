var _ = require('lodash');
const IPFS = require('ipfs');
userdefault = require("./ipfsusage/userdefault.json");
crypto = require('crypto');



module.exports = {

getfile : async function(req, res, next){
  var result = await Ipfsusage.findOne({
        hash : req.body.hash
	    });
	res.json(result);

},


singleuserconfigupdate : async function(req, res, next){

  if(!email) {
    ResponseService.json(403, res, " Email not provided ");
          return;
  }

  var item = await timeupdateuserconfig (res, req.body.email);
        return item;


},

createuserconfig : async function(req, res, next){

  if(!req.body.userid) {
    ResponseService.json(403, res, "Userid does not exist ");
          return;
  }

  if(!req.body.usertype) {
    ResponseService.json(403, res, "usertype not provided ");
          return;
  }
//   ResponseService.json(403, res, "Depreciated , use assignnode");
  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }

  var userc = await Userconfig.findOne({email: user.email, usertype:req.body.usertype});

  if(userc) {
    ResponseService.json(403, res, "Config already exists ");
          return;
  }

 var assrec ;

  if(userc.assignmentname ) {
    ResponseService.json(403, res, "Assignment already exists ");
          return;
  }


 var nodetype = req.body.nodetype;
 if(req.body.usertype == 'C1') {
    assrec = await CreateUserAssignment_C1(req.body.userid, req.body.usertype);
    nodetype = 'privatenode';
 } else if(req.body.usertype == 'A1') {
    assrec = await CreateUserAssignment_A1(req.body.userid, req.body.usertype);
    nodetype = 'privatenode';
 } else if(req.body.usertype == 'A2') {
    assrec = await CreateUserAssignment_A2(req.body.userid, req.body.usertype);
    nodetype = 'publicnode';
 } else {
    ResponseService.json(403, res, "Unknown usertype " + req.body.usertype);
          return;

 }

 var userid = req.body.userid;
 var usertype = req.body.usertype;


  // to be changed with more specific node to assign by default
  //var nodeconfs = await Ipfsprovider.find({nodetype: req.body.nodetype}).limit(1);
	
  var nodeconfs = await Getnodeto_Use(userid, usertype, nodetype) ;

   if(nodeconfs.length != 1) {
    ResponseService.json(403, res, "Node not available ");
          return;

  }
   var nodeconf = nodeconfs[0];

   if(nodeconf.assignmentname) {
       ResponseService.json(403, res, "Node is already assigned ");
       return;
   }


   var useripfsconfig = {
      userid: user.userid,
      usertype: req.body.usertype,
      assignmentname : assrec.assignmentname,
      nodetype: nodeconf.nodetype,
      nodeid: nodeconf.nodeid,
      nodegroup: nodeconf.nodegroup,
      nodename: nodeconf.nodename,
      basepath : nodeconf.basepath,
      usagelimit: nodeconf.usagelimit,
      ipaddress: nodeconf.ipaddress,
      publicgateway: nodeconf.publicgateway,
      localgateway: nodeconf.localgateway,
      config: nodeconf.xconfig
     };



  var newrec = await Userconfig.create({
        email : user.email,
        username : user.username,
        userid : user.userid,
        usertype: req.body.usertype,
        assignmentname : assrec.assignmentname,
        assignment : assrec.id,
        usagelimit : userdefault.usagelimit,
        nodegroup: nodeconf.nodegroup,
        nodetype: nodeconf.nodetype,
	nodeid: nodeconf.nodeid,
        useripfsconfig: useripfsconfig,
	ipfsconfigupdatetime: userdefault.updatedAt,
         } ).fetch();

   var provrec = await Ipfsprovider.update({ id: nodeconf.id}).set({ assignmentname : assrec.assignmentname ,
        assignment : assrec.id,
        usertype: req.body.usertype,
        useraccess : 'enabled'
	   // access control based on assignment and usertype
   
   }).fetch();

        res.json(newrec);


},


updatenodestatus : async function(req, res, next){

   if(!req.body.nodestatus) {
    ResponseService.json(403, res, "Node usage not set   ");
          return;

   }

  if(!req.body.nodeid ) {
    ResponseService.json(403, res, "Node id notset ");
          return;

   }



    var nodeconf = await Ipfsprovider.findOne({nodeid: req.body.nodeid});

   if(!nodeconf) {
    ResponseService.json(403, res, "Nodeid does not exist   ");
          return;

   }


   var newrec = await Ipfsprovider.update({
        id: nodeconf.id}).set({
        nodestatus : req.body.nodestatus,
        //nodegroup : req.body.nodeitem.nodegroup,
        //nodetype : req.body.nodeitem.nodetype,
         } ).fetch();

   res.json(newrec);

},

updatenodeusage : async function(req, res, next){

   if(!req.body.nodeusage) {
    ResponseService.json(403, res, "Node usage not set   ");
          return;

   }

  if(!req.body.nodeid ) {
    ResponseService.json(403, res, "Node id notset ");
          return;

   }



    var nodeconf = await Ipfsprovider.findOne({nodeid: req.body.nodeid});

   if(!nodeconf) {
    ResponseService.json(403, res, "Nodeid does not exist   ");
          return;

   }


   var newrec = await Ipfsprovider.update({
        id: nodeconf.id}).set({
        nodeusage : req.body.nodeusage,
        //nodegroup : req.body.nodeitem.nodegroup,
        //nodetype : req.body.nodeitem.nodetype,
         } ).fetch();

   res.json(newrec);

},

assignnodetouser : async function(req, res, next){

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }

  var userc = await Userconfig.findOne({email: user.email});
  if(!userc) {
    ResponseService.json(403, res, "User config doesnot exist ");
          return;
  }

  if(!userc.assignmentname || userc.assignmentname == '') {
    ResponseService.json(403, res, "User has not assignment ");
          return;
  }

  var nodeconf = await Ipfsprovider.findOne({nodeid: req.body.nodeid});
   if(!nodeconf) {
    ResponseService.json(403, res, "Nodeid does not exist   ");
          return;

  }

  if(nodeconf.assignmentname) {
    ResponseService.json(403, res, "Node alreay assigned. Cannot change ");
          return;
  }




   var useripfsconfig = {
      userid: user.userid,
      nodetype: nodeconf.nodetype,
      nodeid: nodeconf.nodeid,
      nodegroup: nodeconf.nodegroup,
      nodename: nodeconf.nodename,
      assignmentname: userc.assignmentname,
      basepath : nodeconf.basepath,
      usagelimit: nodeconf.usagelimit,
      ipaddress: nodeconf.ipaddress,
      publicgateway: nodeconf.publicgateway,
      localgateway: nodeconf.localgateway,
      config: nodeconf.xconfig
     };

	/*
  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

  if(!tmpuserconfig.assignmentname) {
    ResponseService.json(403, res, "User assignment record not done ");
          return;
  }


  if(nodeconf.assignmentname) {
      if(tmpuserconfig.assignmentname != nodeconf.assignmentname) {
         ResponseService.json(403, res, "assignment name mismatch with node ");
         return;
      } 
   }else {

   var provrec = await Ipfsprovider.update({ id: nodeconf.id}).set({ assignmentname : tmpuserconfig.assignmentname }).fetch();

   }
*/
   var provrec = await Ipfsprovider.update({ id: nodeconf.id}).set({ assignmentname : userc.assignmentname ,
        assignment : userc.id,
   
   }).fetch();

  var newrec = await Userconfig.update({
	id: userc.id}).set({
        usagelimit : userdefault.usagelimit,
        nodegroup: nodeconf.nodegroup,
        nodetype: nodeconf.nodetype,
	providerupdatetime: nodeconf.updatedAt,
	nodeid: nodeconf.nodeid,
        useripfsconfig: useripfsconfig,
         } ).fetch();

        res.json(newrec);


},


	/*
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
      nodegroup: userdefault.nodegroup,
      nodename: userdefault.nodename,
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
        nodegroup: userdefault.nodegroup,
        nodetype: userdefault.nodetype,
	ipfsconfigupdatetime: userdefault.updatedAt,
        useripfsconfig: useripfsconfig,
         } ).fetch();

        res.json(newrec);

},

*/

expandusagelimit : async function(req, res, next){

  var newlimit = req.body.newusagelimit;

  if(!newlimit || newlimit <= 0) {
    ResponseService.json(403, res, "New limit not specified ");
          return;
  }


  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

   tmpuserconfig.useripfsconfig.usagelimit = newlimit;

  var newrec = await Userconfig.update({
	id: tmpuserconfig.id}).set({
        usagelimit : newlimit,
        useripfsconfig: tmpuserconfig.useripfsconfig,
         } ).fetch();

        res.json(newrec);

},

enableuser : async function(req, res, next){


  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }


  var newrec = await Userconfig.update({
	id: tmpuserconfig.id}).set({
        useraccess : 'enabled',
         } ).fetch();

        res.json(newrec);

},

disableuser : async function(req, res, next){


  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }


  var newrec = await Userconfig.update({
	id: tmpuserconfig.id}).set({
        useraccess : 'disabled',
         } ).fetch();

        res.json(newrec);

},

getuserconfig : async function(req, res, next){
// One account for each usertype is allowed

  if(!req.body.userid)  {
    ResponseService.json(403, res, "userid not specified ");
          return;
  }

  if(!req.body.usertype)  {
    ResponseService.json(403, res, "usertype not specified ");
          return;
  }


  var user = await User.findOne({userid: req.body.userid, usertype:req.body.usertype});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }


        res.json(tmpuserconfig);

},
getuserconfigs : async function(req, res, next){


  if(!req.body.userid)  {
    ResponseService.json(403, res, "userid not specified ");
          return;
  }


  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }

  var tmpuserconfig = await Userconfig.find({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }


        res.json(tmpuserconfig);

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

async function timeupdateuserconfig (res, email){

  var userc = await Userconfig.findOne({email: email});
  if(!userc) {
    ResponseService.json(403, res, "Email not found ");
          return;
  }

  var nodeconf = await Ipfsprovider.findOne({nodeid: userc.nodeid});
  if(!nodeconf) {
    ResponseService.json(403, res, "Nodeid not found ");
          return;
  }


   var useripfsconfig = {
      userid: user.userid,
      nodetype: nodeconf.nodetype,
      nodeid: nodeconf.nodeid,
      nodegroup: nodeconf.nodegroup,
      nodename: nodeconf.nodename,
      basepath : nodeconf.basepath,
      usagelimit: nodeconf.usagelimit,
      ipaddress: nodeconf.ipaddress,
      publicgateway: nodeconf.publicgateway,
      localgateway: nodeconf.localgateway,
      config: nodeconf.xconfig
     };

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

  var newrec = await Userconfig.update({
	id: tmpuserconfig.id}).set({
        usagelimit : userdefault.usagelimit,
        nodegroup: nodeconf.nodegroup,
        nodetype: nodeconf.nodetype,
	providerupdatetime: nodeconf.updatedAt,
	nodeid: nodeconf.nodeid,
        useripfsconfig: useripfsconfig,
         } ).fetch();

        res.json(newrec);


};

async function Getnodeto_Use(userid, usertype, nodetype) {
// Get nodes of type private or shared
// multiple users can share node with usergroup assignment
// Not belonging to usergroup can also share. But not implemented
// As it may complicate


  var nodeconfs = await Ipfsprovider.find({where: {assignmentname: '', 
	  nodetype: nodetype, usertype: usertype },limit: 1} );

  return nodeconfs;

	
}

async function CreateUserAssignment_C1(userid, usertype) {

 var buf = crypto.randomBytes(3);
 var rand = buf.toString('hex');
 var assignname = "agnid_"+req.body.userid+"_"+usertype+"_"+ rand;

 var  assrec = await Assignment.create({
        assignmentname : assignmentname,
        userid : userid,
        usergroup : '',
        usertype : usertype,
        nodestatus : 'pending' ,
         } ).fetch();

   return assrec;
}



async function CreateUserAssignment_A1(userid, usertype) {
 var buf = crypto.randomBytes(3);
 var rand = buf.toString('hex');
 var assignname = "agnid_"+req.body.userid+"_"+usertype+"_"+ rand;

 var  assrec = await Assignment.create({
        assignmentname : assignmentname,
        userid : userid,
        usergroup : '',
        usertype : usertype,
        nodestatus : 'pending' ,
         } ).fetch();

   return assrec;
}

async function CreateUserAssignment_A2(userid, usertype) {
 var buf = crypto.randomBytes(3);
 var rand = buf.toString('hex');
 var assignname = "agnid_"+req.body.userid+"_"+usertype+"_"+ rand;

 var  assrec = await Assignment.create({
        assignmentname : assignmentname,
        userid : userid,
        usertype : usertype,
        usergroup : '',
        nodestatus : 'pending' ,
         } ).fetch();

   return assrec;
}

