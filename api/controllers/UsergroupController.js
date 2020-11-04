var _ = require('lodash');
crypto = require('crypto');

const IPFS = require('ipfs');

userdefault = require("./ipfsusage/userdefault.json");

module.exports = {

creategroupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usertype) {
    return ResponseService.json(401, res, "usertype not provided  ")
  }

  if(!req.body.usergroupname) {
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

  var checkgroupname = await Usergroup.find({ where: {userptr: user.id, 
        usergroupname: req.body.usergroupname }});

  if(checkgroupname.length > 0){
    ResponseService.json(403, res, "User group already exists ");
          return;
  }

  var buf = crypto.randomBytes(64);
  var accesssecret = buf.toString('hex');

   buf = crypto.randomBytes(5);
  var rand = buf.toString('hex');
  var groupid = req.body.usergroupname + rand;

  var noderec;



  var grouprec = await Usergroup.create({
        creatoremail: user.email,
        creatorname: user.username,
        creatoruserid: user.userid,
        userptr: user.id,
        groupid: groupid,
        usergroupname: req.body.usergroupname,
        usergroupkey: accesssecret,
        usertype: req.body.usertype,
         } ).fetch();


  var x = await User.addToCollection(user.id, 'usergroup', grouprec.id);

   res.json(grouprec);


},

transmitnodechange : async function(req, res, next){
// to usergroups
	// userconfigs
	// nodegroups (having that node)
	//
  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }


  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});
// noderec has changed
// usergroup also to be updated
  var noderec;

     noderec = await Ipfsprovider.findOne({nodeid: tmpuserconfig.nodeid });
  

  if(!noderec) {
    ResponseService.json(403, res, "No nodes found ");
          return;
  }

  var usergroup = await Usergroup.findOne({creatoremail: user.email});

  if(usergroup) {
    ResponseService.json(403, res, "Only one group allowed");
          return;
  }

     usergroup = await Usergroup.update({
        id: usergroup.id}).set({
           providerupdatetime: noderec.updatedAt,
           nodetype: noderec.nodetype,
           nodegroup: noderec.nodegroup,
         } ).fetch();


   var useripfsconfig = {
      userid: user.userid,
      nodetype: noderec.nodetype,
      nodeid: noderec.nodeid,
      nodegroup: noderec.nodegroup,
        usergroupkey: grouprec.accesssecret,
        usertype: grouprec.usertype,
      nodename: noderec.nodename,
      basepath : noderec.basepath,
      usagelimit: noderec.usagelimit,
      ipaddress: noderec.ipaddress,
      publicgateway: noderec.publicgateway,
      localgateway: noderec.localgateway,
      config: noderec.xconfig
     };


  if(tmpuserconfig) {

     tmpuserconfig = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
	 usergroupname: grouprec.usergroupname,
        usergroupupdatetime: grouprec.updatedAt,
        usertype: grouprec.usertype,
         } ).fetch();
  }

   res.json(tmpuserconfig);


},

createb1groupuser : async function(req, res, next){

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

  var usergroup = await Usergroup.findOne({creatoremail: user.email});

  if(usergroup) {
    ResponseService.json(403, res, "Only one group allowed");
          return;
  }

  var grouprec = await Usergroup.create({
        creatoremail: user.email,
        creatorname: user.username,
        creatoruserid: user.userid,
        usergroupname: req.body.usergroup,
        usergroupkey: accesssecret,
        usertype: "b1earn",
        nodetype: noderec.nodetype,
        providerupdatetime: noderec.updatedAt,
        nodegroup: noderec.nodegroup,
         } ).fetch();



   var useripfsconfig = {
      userid: user.userid,
      nodetype: noderec.nodetype,
      nodeid: noderec.nodeid,
      nodegroup: noderec.nodegroup,
        usergroupkey: grouprec.accesssecret,
        usertype: grouprec.usertype,
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

     tmpuserconfig = await Userconfig.create({
        email : user.email,
        userid : user.userid,
        username : user.username,
        usagelimit : userdefault.usagelimit,
	 usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype,
        useraccess : 'enabled',
        useripfsconfig: useripfsconfig,
         } ).fetch();

  }else {
     tmpuserconfig = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
	 usergroupname: grouprec.usergroupname,
        usergroupupdatetime: grouprec.updatedAt,
        usertype: grouprec.usertype,
         } ).fetch();
  }

   res.json(tmpuserconfig);


},
getusersofgroup: async function(req, res, next){
  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Group name not provided  ")
  }

  var recs = await Userconfig.find({
	 usergroupname: req.body.usergroup }
    );

   res.json(recs);

},

getcreatorofgroup: async function(req, res, next){
  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Group name not provided  ")
  }

  var userec = await Usergroup.findOne({
        usergroupname:req.body.usergroup});

  if(!userec) {
    return ResponseService.json(401, res, "Group not found  ")
  }

  var recs = await Userconfig.findOne({
         email: userec.creatoremail }
    );

   res.json(recs);

},


lista1groups : async function(req, res, next){
  var recs = await Usergroup.find({
	usertype:'a1private'});

   res.json(recs);

},

listmya1groups : async function(req, res, next){
  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var recs = await Usergroup.find({
	  creatoremail: user.email,
        usertype:'a1private'});

   res.json(recs);

},

listmygroups : async function(req, res, next){
  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usertype) {
    return ResponseService.json(401, res, "usertype not provided  ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var recs = await Usergroup.find({
	  creatoremail: user.email,
        usertype: req.body.usertype });

   res.json(recs);

},
listb1groups : async function(req, res, next){
  var recs = await Usergroup.find({
        usertype:'b1earn'});

   res.json(recs);

},

listmyb1groups : async function(req, res, next){
  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var recs = await Usergroup.find({
          creatoremail: user.email,
        usertype:'b1earn'});

   res.json(recs);

},

listjoineda1groups : async function(req, res, next){
  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var db = Ipfsprovider.getDatastore().manager;

    // Now we can do anything we could do with a Mongo `db` instance:
    var collection = db.collection("userconfig");

    collection.distinct("usergroupname", {usertype: 'a1private', userid: req.body.userid}).then(x=> {

        console.log (x);
        res.json(x);
    });



},


listjoineda2groups : async function(req, res, next){
  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var db = Ipfsprovider.getDatastore().manager;

    // Now we can do anything we could do with a Mongo `db` instance:
    var collection = db.collection("userconfig");

    collection.distinct("usergroupname", {usertype: 'a2public', userid: req.body.userid}).then(x=> {

        console.log (x);
        res.json(x);
    });



},

listjoinedc1groups : async function(req, res, next){
  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var db = Ipfsprovider.getDatastore().manager;

    // Now we can do anything we could do with a Mongo `db` instance:
    var collection = db.collection("userconfig");

    collection.distinct("usergroupname", {usertype: 'c1storage', userid: req.body.userid}).then(x=> {

        console.log (x);
        res.json(x);
    });



},


lista2groups : async function(req, res, next){
  var recs = await Usergroup.find({
	usertype:'a2public'});

   res.json(recs);

},

listmya2groups : async function(req, res, next){
  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }
  
  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var recs = await Usergroup.find({
          creatoremail: user.email,
        usertype:'a1public'});

   res.json(recs);

},

listc1groups : async function(req, res, next){
  var recs = await Usergroup.find({
	usertype:'c1storage'});

   res.json(recs);

},

listmyc1groups : async function(req, res, next){
  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }
  
  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }

  var recs = await Usergroup.findOne({
          creatoremail: user.email,
        usertype:'c1storage'});

   res.json(recs);

},


listjoinedgroups : async function(req, res, next){
  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usertype) {
    return ResponseService.json(401, res, "Usertype not provided  ")
  }


  var user = await User.find({userid: req.body.userid}).populate('memberusergroup', {where : { usertype: req.body.usertype}, select:['groupid','usergroupname', 'usertype', 'assignmentname', 'creatoremail', 'nodegroup' ]})

  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }
   
  res.json(user[0]);
},


removefromgroup : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.groupid) {
    return ResponseService.json(401, res, "groupid not provided  ")
  }

  if(!req.body.usertype) {
    return ResponseService.json(401, res, "Usertype not provided  ")
  }



  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }



  var grouprec = await Usergroup.findOne({
        groupid: req.body.groupid,
         } );


  if(!grouprec) {
    ResponseService.json(403, res, "Group record not found ");
          return;
  }
  var x = await User.removeFromCollection(user.id, 'memberusergroup', grouprec.id);
  var y = await Usergroup.removeFromCollection(grouprec.id, 'usersptr', user.id);


   res.json(grouprec);




},
jointogroup : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.groupid) {
    return ResponseService.json(401, res, "groupid not provided  ")
  }

  if(!req.body.usertype) {
    return ResponseService.json(401, res, "Usertype not provided  ")
  }



  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "User record not found ");
          return;
  }



  var grouprec = await Usergroup.findOne({
        groupid: req.body.groupid,
         } );


  if(!grouprec) {
    ResponseService.json(403, res, "Group record not found ");
          return;
  }
  var x = await User.addToCollection(user.id, 'memberusergroup', grouprec.id);
  var y = await Usergroup.addToCollection(grouprec.id, 'usersptr', user.id);


   res.json(grouprec);




},

joina1groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
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




 var leaderconfig = await Userconfig.findOne({usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype});


  if(!leaderconfig) {
    ResponseService.json(403, res, "Leaderconfig not found ");
          return;
  }

   var useripfsconfig =  leaderconfig;
   useripfsconfig.userid = user.userid;


  var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

  if(!tmpuserconfig) {

     tmpuserconfig = await Userconfig.create({
        email : user.email,
        userid : user.userid,
        username : user.username,
        usagelimit : userdefault.usagelimit,
         usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype,
        useraccess : 'enabled',
        useripfsconfig: useripfsconfig,
         } ).fetch();

  }else {
     tmpuserconfig = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
         usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype,
        usergroupupdatetime: grouprec.updatedAt,
         } ).fetch();
  }

   res.json(tmpuserconfig);




},

getb1groupowner : async function(req, res, next){
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

getb1groupuser : async function(req, res, next){

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

  if(!req.body.usertype !=  "a2public") {
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
        usertype: "a2public",
        nodetype: noderec.nodetype,
        providerupdatetime: noderec.updatedAt,
        nodegroup: noderec.nodegroup,
         } ).fetch();



   var useripfsconfig = {
      userid: user.userid,
      nodetype: noderec.nodetype,
      nodeid: noderec.nodeid,
      nodegroup: noderec.nodegroup,
        usergroupkey: grouprec.accesssecret,
        usertype: grouprec.usertype,
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

  if(!tmpuserconfig) {

     tmpuserconfig = await Userconfig.create({
        email : user.email,
        userid : user.userid,
        username : user.username,
        usagelimit : userdefault.usagelimit,
         usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype,
        useraccess : 'enabled',
        useripfsconfig: useripfsconfig,
         } ).fetch();

  }else {
     tmpuserconfig = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
         usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype,
        usergroupupdatetime: grouprec.updatedAt,
         } ).fetch();
  }

   res.json(tmpuserconfig);


},



updatenodegroup:  async function(req, res, next){

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "usergroup not provided  ")
  }

  if(!req.body.nodegroup) {
    return ResponseService.json(401, res, "nodegroup not provided  ")
  }


  var usergrec = await Usergroup.findOne({usergroupname: req.body.usergroup});

  if(!usergrec) {
    return ResponseService.json(401, res, "usergroup not found ")
  }

  var noderec = await Ipfsprovider.findOne({nodegroup: req.body.nodegroup});

  if(!noderec) {
    return ResponseService.json(401, res, "nodegroup not found  ")
  }

	/*
  if(usergrec.nodetype != noderec.nodetype) {
    return ResponseService.json(401, res, "nodetype mismatch ")
  }
	*/

  var grouprec = await Usergroup.update({
        id: usergrec.id}).set({
        nodegroup: req.body.nodegroup,
	}).fetch();

   res.json(grouprec);
},

joina2groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  if(!req.body.usertype !=  "a2public") {
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

  var leaderconfig = await Userconfig.findOne({usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype});


  if(!leaderconfig) {
    ResponseService.json(403, res, "Leaderconfig not found ");
          return;
  }

   var useripfsconfig =  leaderconfig;
   useripfsconfig.userid = user.userid;



    var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

  if(!tmpuserconfig) {

     tmpuserconfig = await Userconfig.create({
        email : user.email,
        userid : user.userid,
        username : user.username,
        usagelimit : userdefault.usagelimit,
         usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype,
        useraccess : 'enabled',
        useripfsconfig: useripfsconfig,
         } ).fetch();

  }else {
     tmpuserconfig = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
         usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype,
        usergroupupdatetime: grouprec.updatedAt,
         } ).fetch();
  }

   res.json(tmpuserconfig);

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
        usertype: "c1storage",
        nodetype: noderec.nodetype,
        providerupdatetime: noderec.updatedAt,
        nodegroup: noderec.nodegroup,
         } ).fetch();



   var useripfsconfig = {
      userid: user.userid,
      nodetype: noderec.nodetype,
      nodeid: noderec.nodeid,
      nodegroup: noderec.nodegroup,
        usergroupkey: grouprec.accesssecret,
        usertype: grouprec.usertype,
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

  if(!tmpuserconfig) {

     tmpuserconfig = await Userconfig.create({
        email : user.email,
        userid : user.userid,
        username : user.username,
        usagelimit : userdefault.usagelimit,
         usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype,
        useraccess : 'enabled',
        useripfsconfig: useripfsconfig,
         } ).fetch();

  }else {
     tmpuserconfig = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
         usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype,
        usergroupupdatetime: grouprec.updatedAt,
         } ).fetch();
  }

   res.json(tmpuserconfig);


},


joinc1groupuser : async function(req, res, next){

  if(!req.body.userid) {
    return ResponseService.json(401, res, "Userid not provided  ")
  }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
  }

  if(!req.body.usertype !=  "c1storage") {
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

  var leaderconfig = await Userconfig.findOne({usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype});


  if(!leaderconfig) {
    ResponseService.json(403, res, "Leaderconfig not found ");
          return;
  }

   var useripfsconfig =  leaderconfig;
   useripfsconfig.userid = user.userid;

    var tmpuserconfig = await Userconfig.findOne({userid: req.body.userid});

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }

  if(!tmpuserconfig) {

     tmpuserconfig = await Userconfig.create({
        email : user.email,
        userid : user.userid,
        username : user.username,
        usagelimit : userdefault.usagelimit,
         usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype,
        useraccess : 'enabled',
        useripfsconfig: useripfsconfig,
         } ).fetch();

  }else {
     tmpuserconfig = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: useripfsconfig,
         usergroupname: grouprec.usergroupname,
        usertype: grouprec.usertype,
        usergroupupdatetime: grouprec.updatedAt,
         } ).fetch();
  }

   res.json(tmpuserconfig);

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

  if(!req.body.usergroupname) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
   }
  if(!req.body.userid) {
    return ResponseService.json(401, res, "Data not provided  ")
   }

   var user= await User.findOne({userid: req.body.userid});

  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }


   var tmpusergroup = await Usergroup.find({where:{creatoremail: user.email, usergroupname: req.body.usergroupname}, limit: 1});

   if(tmpusergroup.length <= 0) {
    ResponseService.json(403, res, "Groupname not found ");
          return;
   }

   if(tmpusergroup[0].usergroupconfig != null ) {
    ResponseService.json(403, res, "Group not detached ");
          return;
   }


   var removing = await Usergroup.destroyOne({id: tmpusergroup[0].id});


   res.json(removing);



},


transmitgroupchange : async function(req, res, next){

  if(!req.body.nodegroup) {
    return ResponseService.json(401, res, " nodegroup not provided  ")
   }

  if(!req.body.usergroup) {
    return ResponseService.json(401, res, "Usergroup not provided  ")
   }



   var tmpusergroup = await Usergroup.findOne({usergroupname: req.body.usergroup});
   if(!tmpusergroup) {
	   
    ResponseService.json(403, res, "User group not found ");
          return;

   }

   var groupusers = await Userconfig.find({usergroupname: req.body.usergroup});

   if(groupusers.length != 1){
          ResponseService.json(403, res, "No users to update ");
          return;
    }


  var noderec = await Ipfsprovider.findOne({nodegroup: req.body.nodegroup });

     for(var i=0; i< groupusers.length; i++) {
     var useripfsconfig = {
      userid: groupusers[i].userid,  // this is wrong. Need to see what to do
      nodetype: noderec.nodetype,
      nodeid: noderec.nodeid,
      nodegroup: noderec.nodegroup,
        usergroupkey: tmpusergroup.accesssecret,
        usertype: tmpusergroup.usertype,
      nodename: noderec.nodename,
      basepath : noderec.basepath,
      usagelimit: noderec.usagelimit,
      ipaddress: noderec.ipaddress,
      publicgateway: noderec.publicgateway,
      localgateway: noderec.localgateway,
      config: noderec.xconfig
     };




   var groupupdate = await Userconfig.update({id: groupusers[i].id}).set({
        useripfsconfig: useripfsconfig,
        nodegroup: noderec.nodegroup,
        providerupdatetime: noderec.updatedAt,
         } ).fetch();
  }

   groupusers = await Userconfig.find({usergroupname: req.body.usergroup});
   res.json(groupusers);



},
remoldovefromgroup : async function(req, res, next){

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

  if(tmpusergroup.creatoremail === tmpuserconfig.email) {
    ResponseService.json(403, res, "You cannot exit your own group");
          return;
  }
 
  var configrec = await Userconfig.update({
        id: tmpuserconfig.id}).set({
        useripfsconfig: null,
         usergroupname: '',
        usertype: ''
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


