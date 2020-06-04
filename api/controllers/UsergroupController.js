var _ = require('lodash');
crypto = require('crypto');

const IPFS = require('ipfs');

userdefault = require("./ipfsusage/userdefault.json");

module.exports = {

createa1groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  if(!req.body.dedicatedorshared) {
    return ResponseService.json(401, res, "dedicatedorshared not set  ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var buf = crypto.randomBytes(64);
  var accesssecret = buf.toString('hex');

  var noderec;

  if(req.body.dedicatedorshared === 'shared') {
     noderec = await Ipfsprovider.findOne({nodetype: 'privatenode', nodeusage: 'shared' });
  }else {
     noderec = await Ipfsprovider.findOne({nodetype: 'privatenode', nodeusage: 'dedicated' });
  }

  if(!noderec) {
    ResponseService.json(403, res, "No nodes found ");
          return;
  }

  var grouprec = await Usergroup.create({
        creatoremail: user.email,
        creatorname: user.username,
        creatoruserid: user.userid,
        usergroupname: req.body.usergroup,
        usergroupkey: accesssecret,
        usergrouptype: "a1private",
        nodetype: noderec.nodetype,
        nodegroup: noderec.nodegroup,
         } ).fetch();



   var useripfsconfig = {
      userid: user.userid,
      nodetype: noderec.nodetype,
      nodeid: noderec.nodeid,
      nodegroup: noderec.nodegroup,
        usergroupkey: grouprec.accesssecret,
        usergrouptype: grouprec.usergrouptype,
      nodename: noderec.nodename,
      basepath : noderec.basepath,
      usagelimit: noderec.usagelimit,
      ipaddress: noderec.ipaddress,
      publicgateway: noderec.publicgateway,
      localgateway: noderec.localgateway,
      config: noderec.xconfig
     };

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

   var configrec = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
	 usergroupname: grouprec.usergroupname,
        usergrouptype: grouprec.usergrouptype,
         } ).fetch();

   res.json(configrec);


},


lista1groups : async function(req, res, next){
  var recs = await Usergroup.find({
	usergrouptype:'a1private'});

   res.json(recs);

},

lista2groups : async function(req, res, next){
  var recs = await Usergroup.find({
	usergrouptype:'a1public'});

   res.json(recs);

},


listc1groups : async function(req, res, next){
  var recs = await Usergroup.find({
	usergrouptype:'c1storage'});

   res.json(recs);

},


joina1groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  if(!req.body.usergrouptype !=  "a1private") {
    return ResponseService.json(401, res, "Usergrouptype wrong ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

//  var buf = crypto.randomBytes(64);
//  var accesssecret = buf.toString('hex');



  var grouprec = await Usergroup.findOne({
        usergroupname: req.body.usergroup,
         } );

  var noderec = await Ipfsprovider.findOne({nodegroup: grouprec.nodegroup });


   var useripfsconfig = {
      userid: user.userid,
      nodetype: noderec.nodetype,
      nodeid: noderec.nodeid,
      nodegroup: noderec.nodegroup,
        usergroupkey: grouprec.accesssecret,
        usergrouptype: grouprec.usergrouptype,
      nodename: noderec.nodename,
      basepath : noderec.basepath,
      usagelimit: noderec.usagelimit,
      ipaddress: noderec.ipaddress,
      publicgateway: noderec.publicgateway,
      localgateway: noderec.localgateway,
      config: noderec.xconfig
     };

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

   var configrec = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
	 usergroupname: grouprec.usergroupname,
        usergrouptype: grouprec.usergrouptype,
         } ).fetch();

   res.json(configrec);

},

geta1groupowner : async function(req, res, next){
   if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  var grouprec = await Usergroup.findOne({
        usergroupname: req.body.usergroup,
         } );

  if(!grouprec) {
    ResponseService.json(403, res, "Group not found ");
          return;
  }

  res.json(grouprec);

},

geta1groupusers : async function(req, res, next){
   if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  var configrecs = await Userconfig.find({
         usergroupname: req.body.usergroup });

  res.json(configrecs);
},


geta1groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

	/*
  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

	*/
  var userconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!userconfig) {
    return ResponseService.json(401, res, "Userconfig not found  ")
  }

  if(!userconfig.useripfsconfig) {
    return ResponseService.json(401, res, "Useripfsconfig not found  ")
  }

   res.json(userconfig);

},




createa2groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  if(!req.body.dedicatedorshared) {
    return ResponseService.json(401, res, "dedicatedorshared not set  ")
  }

  if(!req.body.usergrouptype !=  "a2public") {
    return ResponseService.json(401, res, "Usergrouptype wrong ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var buf = crypto.randomBytes(64);
  var accesssecret = buf.toString('hex');

  var noderec;

  if(req.body.dedicatedorshared === 'shared') {
     noderec = await Ipfsprovider.findOne({nodetype: 'publicnode', nodeusage: 'shared' });
  }else {
     noderec = await Ipfsprovider.findOne({nodetype: 'publicnode', nodeusage: 'dedicated' });
  }


  var grouprec = await Usergroup.create({
        creatoremail: user.email,
        creatorname: user.username,
        creatoruserid: user.userid,
        usergroupname: req.body.usergroup,
        usergroupkey: accesssecret,
        usergrouptype: "a2public",
        nodetype: noderec.nodetype,
        nodegroup: noderec.nodegroup,
         } ).fetch();



   var useripfsconfig = {
      userid: user.userid,
      nodetype: noderec.nodetype,
      nodeid: noderec.nodeid,
      nodegroup: noderec.nodegroup,
        usergroupkey: grouprec.accesssecret,
        usergrouptype: grouprec.usergrouptype,
      nodename: noderec.nodename,
      basepath : noderec.basepath,
      usagelimit: noderec.usagelimit,
      ipaddress: noderec.ipaddress,
      publicgateway: noderec.publicgateway,
      localgateway: noderec.localgateway,
      config: noderec.xconfig
     };

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

   var configrec = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
	 usergroupname: grouprec.usergroupname,
        usergrouptype: grouprec.usergrouptype,
         } ).fetch();

   res.json(configrec);


},


joina2groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  if(!req.body.usergrouptype !=  "a2public") {
    return ResponseService.json(401, res, "Usergrouptype wrong ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var noderec;


  var grouprec = await Usergroup.findOne({
        usergroupname: req.body.usergroup,
         } );

  var noderec = await Ipfsprovider.findOne({nodegroup: grouprec.nodegroup });

   var useripfsconfig = {
      userid: user.userid,
      nodetype: noderec.nodetype,
      nodeid: noderec.nodeid,
      nodegroup: noderec.nodegroup,
        usergroupkey: grouprec.accesssecret,
        usergrouptype: grouprec.usergrouptype,
      nodename: noderec.nodename,
      basepath : noderec.basepath,
      usagelimit: noderec.usagelimit,
      ipaddress: noderec.ipaddress,
      publicgateway: noderec.publicgateway,
      localgateway: noderec.localgateway,
      config: noderec.xconfig
     };

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

   var configrec = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
	 usergroupname: grouprec.usergroupname,
        usergrouptype: grouprec.usergrouptype,
         } ).fetch();

   res.json(configrec);

},

geta2groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  var userconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!userconfig) {
    return ResponseService.json(401, res, "Userconfig not found  ")
  }

  if(!userconfig.useripfsconfig) {
    return ResponseService.json(401, res, "Useripfsconfig not found  ")
  }

   res.json(userconfig);

},







joinb1nodesuser : async function(req, res, next){
  var conf = {
          "configtype": "a1private",
          "groupname": "group12", 
          "privnodekey": "xxx12", // on login give this key
          "nodelist": []
  };
	res.json(conf);

},

getb1nodesuser : async function(req, res, next){
  var conf = {
          "configtype": "a1private",
          "groupname": "group12",
          "privnodekey": "xxx12", // on login give this key
          "nodelist": []
  };

},



createc1groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  if(!req.body.dedicatedorshared) {
    return ResponseService.json(401, res, "dedicatedorshared not set  ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var buf = crypto.randomBytes(64);
  var accesssecret = buf.toString('hex');

  var noderec;

  noderec = await Ipfsprovider.findOne({nodetype: 'privatenode', nodeusage: 'dedicated' });


  var grouprec = await Usergroup.create({
        creatoremail: user.email,
        creatorname: user.username,
        creatoruserid: user.userid,
        usergroupname: req.body.usergroup,
        usergroupkey: accesssecret,
        usergrouptype: "c1storage",
        nodetype: noderec.nodetype,
        nodegroup: noderec.nodegroup,
         } ).fetch();



   var useripfsconfig = {
      userid: user.userid,
      nodetype: noderec.nodetype,
      nodeid: noderec.nodeid,
      nodegroup: noderec.nodegroup,
        usergroupkey: grouprec.accesssecret,
        usergrouptype: grouprec.usergrouptype,
      nodename: noderec.nodename,
      basepath : noderec.basepath,
      usagelimit: noderec.usagelimit,
      ipaddress: noderec.ipaddress,
      publicgateway: noderec.publicgateway,
      localgateway: noderec.localgateway,
      config: noderec.xconfig
     };

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

   var configrec = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
	 usergroupname: grouprec.usergroupname,
        usergrouptype: grouprec.usergrouptype,
         } ).fetch();

   res.json(configrec);


},


joinc1groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  if(!req.body.usergrouptype !=  "c1storage") {
    return ResponseService.json(401, res, "Usergrouptype wrong ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var buf = crypto.randomBytes(64);
  var accesssecret = buf.toString('hex');



  var grouprec = await Usergroup.findOne({
        usergroupname: req.body.usergroup,
         } );

  var noderec = await Ipfsprovider.findOne({nodegroup: grouprec.nodegroup });


   var useripfsconfig = {
      userid: user.userid,
      nodetype: noderec.nodetype,
      nodeid: noderec.nodeid,
      nodegroup: noderec.nodegroup,
        usergroupkey: grouprec.accesssecret,
        usergrouptype: grouprec.usergrouptype,
      nodename: noderec.nodename,
      basepath : noderec.basepath,
      usagelimit: noderec.usagelimit,
      ipaddress: noderec.ipaddress,
      publicgateway: noderec.publicgateway,
      localgateway: noderec.localgateway,
      config: noderec.xconfig
     };

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

   var configrec = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
	 usergroupname: grouprec.usergroupname,
        usergrouptype: grouprec.usergrouptype,
         } ).fetch();

   res.json(configrec);

},

getc1groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  var userconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!userconfig) {
    return ResponseService.json(401, res, "Userconfig not found  ")
  }

  if(!userconfig.useripfsconfig) {
    return ResponseService.json(401, res, "Useripfsconfig not found  ")
  }

   res.json(userconfig);

},


deletemygroup : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Data not provided  ")
   }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
   }

   var user= await User.findOne({userid: req.body.userid});

  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }


   var tmpusergroup = await Usergroup.findOne({creatoremail: user.email});
   if(tmpusergroup.usergroupname != req.body.usergroup) {
	   
    ResponseService.json(403, res, "Not owner of group to delete ");
          return;

   }

   var groupusers = await Userconfig.find({usergroupname: req.body.req.body.usergroup});

   if(groupusers.length != 0){
          ResponseService.json(403, res, "Others using this group ");
          return;
    }

   var configrec = await Usergroup.remove({
        creatormail: user.email});

   res.json(configrec);


}


removefromgroup : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Data not provided  ")
   }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
   }

   var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid, usergroupname: req.body.usergroup});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "User not in group ");
          return;
  }
   var tmpusergroup = await Usergroup.findOne({userid: req.body.userid});

   var configrec = await Usergroup.remove({
        useripfsconfig: null,
         usergroupname: '',
        usergrouptype: ''
         } ).fetch();

   res.json(configrec);


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


