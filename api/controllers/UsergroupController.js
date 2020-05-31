var _ = require('lodash');
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


  var grouprec = await Usergroup.create({
        creatoremail: user.email,
        creatorname: user.name,
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
         } ).fetch();

   res.json(configrec);


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
         } ).fetch();

   res.json(configrec);

},

geta1groupuser : async function(req, res, next){

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
        creatorname: user.name,
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
        creatorname: user.name,
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







removefromgroup : async function(req, res, next){
    if(!req.body) {
    return ResponseService.json(401, res, "Data not provided  ")
    }
  var result = await Usergroup.remove({
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


