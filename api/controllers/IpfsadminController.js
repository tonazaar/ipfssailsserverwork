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
  var userc = await GetUserconfig_Asowner(req.body.userid, req.body.usertype) ;

//  var userc = await Userconfig.findOne({userid: userid, usertype:req.body.usertype});

  if(userc) {
    ResponseService.json(403, res, "Config already exists ");
          return;
  }

 var assrec ;



 var userid = req.body.userid;
 var usertype = req.body.usertype;
 var nodetype = req.body.nodetype;
 if(usertype == 'C1') {
    assrec = await CreateUserAssignment_C1(userid, usertype);
    nodetype = 'privatenode';
 } else if(usertype == 'A1') {
    assrec = await CreateUserAssignment_A1(userid, usertype);
    nodetype = 'privatenode';
 } else if(usertype == 'A2') {
    assrec = await CreateUserAssignment_A2(userid, usertype);
    nodetype = 'publicnode';
 } else {
    ResponseService.json(403, res, "Unknown usertype " + usertype);
          return;

 }


 if(!assrec) {
    ResponseService.json(403, res, "No assignement " );
          return;
 };
/* 
 * User is alloted private node,  public node (shared to be considered later)
 * User or User groups based access can be present  
 * In A1, A2 group based access is provided
 * In C1 no groups present
 */

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
      userid: userid,
      usertype: usertype,
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
        usertype: usertype,
        assignmentname : assrec.assignmentname,
        assignment : assrec.id,
        usagelimit : userdefault.usagelimit,
        nodegroup: nodeconf.nodegroup,
        nodetype: nodeconf.nodetype,
	nodeid: nodeconf.nodeid,
        useripfsconfig: useripfsconfig,
	ipfsconfigupdatetime: userdefault.updatedAt,
         } ).fetch();

   var provrec = await Ipfsvirtualprovider.create({  assignmentname : assrec.assignmentname ,
      nodetype: nodeconf.nodetype,
      nodeid: nodeconf.nodeid,
      nodegroup: nodeconf.nodegroup,
      nodename: nodeconf.nodename,
      basepath : nodeconf.basepath,
      usagelimit: nodeconf.usagelimit,
      ipaddress: nodeconf.ipaddress,
      publicgateway: nodeconf.publicgateway,
      localgateway: nodeconf.localgateway,
      config: nodeconf.xconfig,
        assignment : assrec.id,
        ipfsprovider : nodeconf.id,
        usertype: usertype,
        useraccess : 'enabled'
  // access control based on assignment and usertype
   
   }).fetch();

//   var x = await User.update({ id: user.id}, 'Userconfig').addToCollection(newrec.id);
   var x = await User.addToCollection(user.id, 'userconfig', newrec.id);
//   var y = await Assignment.addToCollection(assrec.id, 'nodeproviders', nodeconf.id);

   res.json(newrec);
},


createpersonaluserconfig : async function(req, res, next){

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

  var userc = await GetPersonalUserconfig_Asowner(req.body.userid, req.body.usertype) ;

   console.log("userc=" + JSON.stringify(userc));


  if(userc) {
    ResponseService.json(403, res, "Config already exists ");
          return;
  }

 var assrec ;



 var userid = req.body.userid;
 var usertype = req.body.usertype;
 var nodetype = req.body.nodetype;
 if(usertype == 'C1') {
    assrec = await CreateUserAssignment_C1(userid, usertype);
    nodetype = 'personalnode';
 } else {
    ResponseService.json(403, res, "Unknown usertype " + usertype);
          return;

 }


 if(!assrec) {
    ResponseService.json(403, res, "No assignement " );
          return;
 };
/* 
 * User is alloted private node,  public node (shared to be considered later)
 * User or User groups based access can be present  
 * In A1, A2 group based access is provided
 * In C1 no groups present
 */

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
      userid: userid,
      personalid: userid,
      usertype: usertype,
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

  var newrec = await Userpersonalconfig.create({
        email : user.email,
        username : user.username,
        userid : user.userid,
        personalid : user.userid,
        usertype: usertype,
        assignmentname : assrec.assignmentname,
        assignment : assrec.id,
        usagelimit : userdefault.usagelimit,
        nodegroup: nodeconf.nodegroup,
        nodetype: nodeconf.nodetype,
	nodeid: nodeconf.nodeid,
        personalipfsconfig: useripfsconfig,
	ipfsconfigupdatetime: userdefault.updatedAt,
         } ).fetch();


 var provrec = await Ipfsvirtualprovider.create({  assignmentname : assrec.assignmentname ,
      nodetype: nodeconf.nodetype,
      nodeid: nodeconf.nodeid,
      nodegroup: nodeconf.nodegroup,
      nodename: nodeconf.nodename,
      basepath : nodeconf.basepath,
      usagelimit: nodeconf.usagelimit,
      ipaddress: nodeconf.ipaddress,
      publicgateway: nodeconf.publicgateway,
      localgateway: nodeconf.localgateway,
      config: nodeconf.xconfig,
        assignment : assrec.id,
        ipfsprovider : nodeconf.id,
        usertype: usertype,
        useraccess : 'enabled'


  // access control based on assignment and usertype
   
   }).fetch();

//   var x = await User.update({ id: user.id}, 'Userconfig').addToCollection(newrec.id);
   var x = await User.update({id: user.id}).set({userpersonalconfig:  newrec.id});
//   var y = await Assignment.addToCollection(assrec.id, 'nodeproviders', nodeconf.id);

   res.json(newrec);
},


updateuserconfig : async function(req, res, next){

  if(!req.body.userid) {
    ResponseService.json(403, res, "Userid does not exist ");
          return;
  }

  if(!req.body.usertype) {
    ResponseService.json(403, res, "usertype not provided ");
          return;
  }

  if(!req.body.newnodeid) {
    ResponseService.json(403, res, "newnodeid not provided ");
          return;
  }


//   ResponseService.json(403, res, "Depreciated , use assignnode");
  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }

  var userc = await GetUserconfig_Asowner(req.body.userid, req.body.usertype) ;

  if(!userc) {
    ResponseService.json(403, res, "Config does not exist ");
          return;
  }

  if(!userc.assignment) {
    ResponseService.json(403, res, "Assignment does not exist ");
          return;
  }

  if(userc.nodeid == req.body.newnodeid) {
    ResponseService.json(403, res, "The same node is already assigned");
          return;
  }

  console.log(JSON.stringify(userc));

 var assrec = userc.assignment;


 if(!assrec) {
    ResponseService.json(403, res, "No assignement " );
          return;
 };

 var userid = req.body.userid;
 var usertype = req.body.usertype;
 var nodetype = req.body.nodetype;

/* 
 * User is alloted private node,  public node (shared to be considered later)
 * User or User groups based access can be present  
 * In A1, A2 group based access is provided
 * In C1 no groups present
 */

  await ReleaseNodeAssignment(userc.nodeid, userc.assignmentname, userc.assignment);

   var nodeconfs = await Ipfsprovider.find({ nodeid: req.body.newnodeid});


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
      userid: userid,
      usertype: usertype,
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

  var newrec = await Userconfig.update({id:userc.id}).set({
        nodegroup: nodeconf.nodegroup,
        nodetype: nodeconf.nodetype,
	nodeid: nodeconf.nodeid,
        useripfsconfig: useripfsconfig,
	ipfsconfigupdatetime: userdefault.updatedAt,
         } ).fetch();


  var provrec = await Ipfsvirtualprovider.create({  assignmentname : assrec.assignmentname ,
      nodetype: nodeconf.nodetype,
      nodeid: nodeconf.nodeid,
      nodegroup: nodeconf.nodegroup,
      nodename: nodeconf.nodename,
      basepath : nodeconf.basepath,
      usagelimit: nodeconf.usagelimit,
      ipaddress: nodeconf.ipaddress,
      publicgateway: nodeconf.publicgateway,
      localgateway: nodeconf.localgateway,
      config: nodeconf.xconfig,
        assignment : assrec.id,
        ipfsprovider : nodeconf.id,
        usertype: usertype,
        useraccess : 'enabled'


  // access control based on assignment and usertype
   
   }).fetch();


   res.json(newrec);
},

updatepersonaluserconfig : async function(req, res, next){

  if(!req.body.userid) {
    ResponseService.json(403, res, "Userid does not exist ");
          return;
  }

  if(!req.body.usertype) {
    ResponseService.json(403, res, "usertype not provided ");
          return;
  }

  if(!req.body.newnodeid) {
    ResponseService.json(403, res, "newnodeid not provided ");
          return;
  }


//   ResponseService.json(403, res, "Depreciated , use assignnode");
  var user = await User.findOne({userid: req.body.userid});
  if(!user) {
    ResponseService.json(403, res, "No user record ");
          return;
  }

  var userc = await GetPersonalUserconfig_Asowner(req.body.userid, req.body.usertype) ;

  if(!userc) {
    ResponseService.json(403, res, "Config does not exist ");
          return;
  }

  if(!userc.assignment) {
    ResponseService.json(403, res, "Assignment does not exist ");
          return;
  }

  if(userc.nodeid == req.body.newnodeid) {
    ResponseService.json(403, res, "The same node is already assigned");
          return;
  }

  console.log(JSON.stringify(userc));

 var assrec = userc.assignment;


 if(!assrec) {
    ResponseService.json(403, res, "No assignement " );
          return;
 };

 var userid = req.body.userid;
 var usertype = req.body.usertype;
 var nodetype = req.body.nodetype;

/* 
 * User is alloted private node,  public node (shared to be considered later)
 * User or User groups based access can be present  
 * In A1, A2 group based access is provided
 * In C1 no groups present
 */

  await ReleaseNodeAssignment(userc.nodeid, userc.assignmentname, userc.assignment);

   var nodeconfs = await Ipfsprovider.find({ nodeid: req.body.newnodeid});



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
      userid: userid,
      usertype: usertype,
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

  var newrec = await Userpersonalconfig.update({id:userc.id}).set({
        nodegroup: nodeconf.nodegroup,
        nodetype: nodeconf.nodetype,
	nodeid: nodeconf.nodeid,
        personalipfsconfig: useripfsconfig,
	ipfsconfigupdatetime: userdefault.updatedAt,
         } ).fetch();



  var provrec = await Ipfsvirtualprovider.create({  assignmentname : assrec.assignmentname ,
      nodetype: nodeconf.nodetype,
      nodeid: nodeconf.nodeid,
      nodegroup: nodeconf.nodegroup,
      nodename: nodeconf.nodename,
      basepath : nodeconf.basepath,
      usagelimit: nodeconf.usagelimit,
      ipaddress: nodeconf.ipaddress,
      publicgateway: nodeconf.publicgateway,
      localgateway: nodeconf.localgateway,
      config: nodeconf.xconfig,
        assignment : assrec.id,
        ipfsprovider : nodeconf.id,
        usertype: usertype,
        useraccess : 'enabled'


  // access control based on assignment and usertype
   
   }).fetch();


   res.json(newrec);
},

deletegroupconfig : async function(req, res, next){

  if(!req.body.groupid) {
    ResponseService.json(403, res, "groupid does not exist ");
          return;
  }

  if(!req.body.usergroupname) {
    ResponseService.json(403, res, "usergroupname does not exist ");
          return;
  }


  if(!req.body.usertype) {
    ResponseService.json(403, res, "usertype not provided ");
          return;
  }
//   ResponseService.json(403, res, "Depreciated , use assignnode");
  var userg = await Usergroup.findOne({groupid: req.body.groupid});
  if(!userg) {
    ResponseService.json(403, res, "No userg record ");
          return;
  }

  var usergc = await Usergroupconfig.find({where: {groupid: req.body.groupid }, limit:1});

  if(usergc.length <= 0) {
    ResponseService.json(403, res, "Usergroup config does not exist ");
          return;
  }

/*

   var provrec = await Ipfsprovider.update({ nodeid: usergc[0].nodeid }).set({ assignmentname : ''  ,
        assignment : null ,
	 }).fetch(); */
  // access control based on assignment and usertype

  await DeleteUsergroupAssignment(usergc[0].groupid, usergc[0].assignmentname);
  await ReleaseNodeAssignment(usergc[0].nodeid, usergc[0].assignmentname, usergc[0].assignment);

   
  await Usergroup.update({id: userg.id}).set({usergroupconfig: null}); 

  var rem = await Usergroupconfig.destroyOne({id: usergc[0].id});
   res.json(rem);
},

creategroupconfig : async function(req, res, next){

  if(!req.body.groupid) {
    ResponseService.json(403, res, "groupid does not exist ");
          return;
  }

  if(!req.body.usergroupname) {
    ResponseService.json(403, res, "usergroupname does not exist ");
          return;
  }


  if(!req.body.usertype) {
    ResponseService.json(403, res, "usertype not provided ");
          return;
  }
//   ResponseService.json(403, res, "Depreciated , use assignnode");
  var userg = await Usergroup.findOne({groupid: req.body.groupid});
  if(!userg) {
    ResponseService.json(403, res, "No userg record ");
          return;
  }

  if(userg.usergroupconfig) {
    ResponseService.json(403, res, "Group config already exists for group");
          return;
  }


  var usergc = await Usergroupconfig.findOne({groupid: req.body.groupid});

  if(usergc) {
    ResponseService.json(403, res, "Usergroup config already exists ");
          return;
  }

 var assrec ;



 var usertype = req.body.usertype;
 var nodetype = req.body.nodetype;

// add a node and a assignment for the group of user
 if(usertype == 'A1') {
    assrec = await CreateGroupAssignment_A1(userg, usertype);
    nodetype = 'privatenode';
 } else if(usertype == 'A2') {
    assrec = await CreateGroupAssignment_A2(userg, usertype) ;
    nodetype = 'publicnode';
 } else {
    ResponseService.json(403, res, "Unknown usertype " + usertype);
          return;

 }

/* 
 * User is alloted private node,  public node (shared to be considered later)
 * User or User groups based access can be present  
 * In A1, A2 group based access is provided
 * In C1 no groups present
 */

  var nodeconfs = await Getnodeto_Use(userg.groupid, usertype, nodetype) ;

   if(nodeconfs.length != 1) {
    ResponseService.json(403, res, "Node not available ");
          return;

  }
   var nodeconf = nodeconfs[0];

   if(nodeconf.assignmentname) {
       ResponseService.json(403, res, "Node is already assigned ");
       return;
   }


   var groupipfsconfig = {
      userid: userg.userid,
        groupid : userg.groupid,
      usertype: usertype,
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

  var newrec = await Usergroupconfig.create({
        email : userg.creatoremail,
        username : userg.creatorname,
        userid : userg.creatoruserid,
        groupid : userg.groupid,
        usertype: usertype,
        assignmentname : assrec.assignmentname,
        assignment : assrec.id,
        usergroupptr : userg.id,
        usagelimit : userdefault.usagelimit,
        nodegroup: nodeconf.nodegroup,
        nodetype: nodeconf.nodetype,
	nodeid: nodeconf.nodeid,
        groupipfsconfig: groupipfsconfig,
	ipfsconfigupdatetime: userdefault.updatedAt,
         } ).fetch();


	
     var provrec = await Ipfsvirtualprovider.create({  assignmentname : assrec.assignmentname ,
      nodetype: nodeconf.nodetype,
      nodeid: nodeconf.nodeid,
      nodegroup: nodeconf.nodegroup,
      nodename: nodeconf.nodename,
      basepath : nodeconf.basepath,
      usagelimit: nodeconf.usagelimit,
      ipaddress: nodeconf.ipaddress,
      publicgateway: nodeconf.publicgateway,
      localgateway: nodeconf.localgateway,
      config: nodeconf.xconfig,
        assignment : assrec.id,
        ipfsprovider : nodeconf.id,
        usertype: usertype,
        useraccess : 'enabled'

  // access control based on assignment and usertype
   
   }).fetch();

   var x = await Usergroup.update({id: userg.id}).set({usergroupconfig: newrec.id});
//   var y = await Assignment.addToCollection(assrec.id, 'nodeproviders', provrec.id);
	
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

updatenodeitem : async function(req, res, next){


  if(!req.body.nodeid ) {
    ResponseService.json(403, res, "Node id notset ");
          return;
   }

  if(!req.body.nodeitem ) {
    ResponseService.json(403, res, "nodeitem id notset ");
          return;
   }



    var nodeconf = await Ipfsprovider.findOne({nodeid: req.body.nodeid});

   if(!nodeconf) {
    ResponseService.json(403, res, "Nodeid does not exist   ");
          return;

   }


   var newrec = await Ipfsprovider.update({
        id: nodeconf.id}).set(req.body.nodeitem).fetch();

   res.json(newrec);

},

updatevirtualnodeitem : async function(req, res, next){


  if(!req.body.nodeid ) {
    ResponseService.json(403, res, "Node id notset ");
          return;
   }

  if(!req.body.nodeitem ) {
    ResponseService.json(403, res, "nodeitem id notset ");
          return;
   }

  if(!req.body.nodeitem.assignmentname ) {
    ResponseService.json(403, res, "assignmentname id notset ");
          return;
   }




    var nodeconf = await Ipfsvirtualprovider.findOne({id: req.body.nodeitem.id});

   if(!nodeconf) {
    ResponseService.json(403, res, "Nodeid does not exist   ");
          return;

   }


   var newrec = await Ipfsvirtualprovider.update({
        id: nodeconf.id}).set(req.body.nodeitem).fetch();

   res.json(newrec);

},

joinnodetouser : async function(req, res, next){

},

droppedassignnodetouser : async function(req, res, next){

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

  var usertype = req.body.usertype;
  var userid = req.body.userid;

  var tmpuserconfig = await GetUserconfig_Asowner(userid, usertype) ;

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }


   res.json(tmpuserconfig.useripfsconfig);

},

getpersonaluserconfig : async function(req, res, next){
// One account for each usertype is allowed

  if(!req.body.userid)  {
    ResponseService.json(403, res, "userid not specified ");
          return;
  }

  if(!req.body.usertype)  {
    ResponseService.json(403, res, "usertype not specified ");
          return;
  }

  var usertype = req.body.usertype;
  var userid = req.body.userid;
	console.log("userid=" + userid);                            
	console.log("usertype=" + usertype);                            

  var tmpuserconfig = await GetPersonalUserconfig_Asowner(userid, usertype) ;

	console.log("getpersonaluserconfig=" + JSON.stringify(tmpuserconfig));
  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }


   res.json(tmpuserconfig.personalipfsconfig);

},


deleteuserconfig : async function(req, res, next){
// One account for each usertype is allowed

  if(!req.body.userid)  {
    ResponseService.json(403, res, "userid not specified ");
          return;
  }

  if(!req.body.usertype)  {
    ResponseService.json(403, res, "usertype not specified ");
          return;
  }

  var usertype = req.body.usertype;
  var userid = req.body.userid;

  var tmpuserconfig = await GetUserconfig_Asowner(userid, usertype) ;

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }


  await DeleteAssignment(userid, tmpuserconfig.assignmentname);
  await ReleaseNodeAssignment(tmpuserconfig.nodeid, tmpuserconfig.assignmentname, tmpuserconfig.assignment);

  var rem = await Userconfig.destroyOne({id: tmpuserconfig.id});
   res.json(rem);

},

deletepersonaluserconfig : async function(req, res, next){
// One account for each usertype is allowed

  if(!req.body.userid)  {
    ResponseService.json(403, res, "userid not specified ");
          return;
  }

  if(!req.body.usertype)  {
    ResponseService.json(403, res, "usertype not specified ");
          return;
  }

  var usertype = req.body.usertype;
  var userid = req.body.userid;

  var tmpuserconfig = await GetPersonalUserconfig_Asowner(userid, usertype) ;

  if(!tmpuserconfig) {
    ResponseService.json(403, res, "No user config record ");
          return;
  }


  await DeleteAssignment(userid, tmpuserconfig.assignmentname);
  await ReleaseNodeAssignment(tmpuserconfig.nodeid, tmpuserconfig.assignmentname, tmpuserconfig.assignment);

  var rem = await Userpersonalconfig.destroyOne({id: tmpuserconfig.id});
   res.json(rem);

},

getusergroupconfig : async function(req, res, next){
// One account for each usertype is allowed

  if(!req.body.groupid)  {
    ResponseService.json(403, res, "groupid not specified ");
          return;
  }

  var groupid = req.body.groupid;


  var tmp= await GetUsergroup_config(groupid) ;

  if(!tmp) {
    ResponseService.json(403, res, "Group config not found ");
          return;
  }


   res.json(tmp.groupipfsconfig);

},

setusergroupconfig : async function(req, res, next){
// One account for each usertype is allowed

  if(!req.body.groupid)  {
    ResponseService.json(403, res, "groupid not specified ");
          return;
  }
  if(!req.body.userid)  {
    ResponseService.json(403, res, "userid not specified ");
          return;
  }

  var groupid = req.body.groupid;
  var userid = req.body.userid;


  var tmp= await GetUsergroup_config(groupid) ;

  if(!tmp) {
    ResponseService.json(403, res, "Group config not found ");
          return;
  }

  await SetUsergroupTouser(userid, groupid);


   res.json(tmp.groupipfsconfig);

},

getusergroupconfigdefault : async function(req, res, next){
// One account for each usertype is allowed

  if(!req.body.userid)  {
    ResponseService.json(403, res, "groupid not specified ");
          return;
  }

  var userid = req.body.userid;

  var user = await User.findOne({userid: req.body.userid});

  var tmp= await GetUsergroup_config(user.selectedgroupid) ;

  if(!tmp) {
    ResponseService.json(403, res, "Group config not found ");
          return;
  }


   res.json(tmp.groupipfsconfig);

},
getjoinedgroupconfig : async function(req, res, next){
// One account for each usertype is allowed

  if(!req.body.groupid)  {
    ResponseService.json(403, res, "groupid not specified ");
          return;
  }
  if(!req.body.userid)  {
    ResponseService.json(403, res, "userid not specified ");
          return;
  }

  if(!req.body.usertype)  {
    ResponseService.json(403, res, "usertype not specified ");
          return;
  }


  var user = await User.findOne({userid: req.body.userid}).populate('memberusergroup', {where : { usertype: req.body.usertype, groupid: req.body.groupid}, select:['groupid','usergroupname', 'usertype', 'assignmentname', 'creatoremail', 'nodegroup' ]})

  if(user.memberusergroup.length != 1){
    ResponseService.json(403, res, "user not member ");
          return;
  }

  var groupid = req.body.groupid;


  var tmp= await GetUsergroup_config(groupid) ;

  if(!tmp) {
    ResponseService.json(403, res, "Group config not found ");
          return;
  }


   res.json(tmp.groupipfsconfig);

},

setjoinedgroupconfig : async function(req, res, next){
// One account for each usertype is allowed

  if(!req.body.groupid)  {
    ResponseService.json(403, res, "groupid not specified ");
          return;
  }
  if(!req.body.userid)  {
    ResponseService.json(403, res, "userid not specified ");
          return;
  }

  if(!req.body.usertype)  {
    ResponseService.json(403, res, "usertype not specified ");
          return;
  }

 // var user = await User.find({userid: req.body.userid}).populate('memberusergroup', {where : { usertype: req.body.usertype}, select:['groupid','usergroupname', 'usertype', 'assignmentname', 'creatoremail', 'nodegroup' ]})

  var user = await User.find({userid: req.body.userid}).populate('memberusergroup', {where : { usertype: req.body.usertype, groupid: req.body.groupid}, select:['groupid','usergroupname', 'usertype', 'assignmentname', 'creatoremail', 'nodegroup' ]})

  if(user[0].memberusergroup.length != 1){
	console.log(JSON.stringify(user.memberusergroup));
    ResponseService.json(403, res, "user not member ");
          return;
  }

  var groupid = req.body.groupid;
  var userid = req.body.userid;


  var tmp= await GetUsergroup_config(groupid) ;

  if(!tmp) {
    ResponseService.json(403, res, "Group config not found ");
          return;
  }

  await SetUsergroupTouser(userid, groupid);


   res.json(tmp.groupipfsconfig);

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

async function CreateUserconfig_asOwner(userid, usergroup, nodetype) {
}

async function AddNode_asOwner(userid, usergroup, nodetype) {
}

async function GetUsergroup_config(groupid) {
// get userconfig for accessing groups
  var tmpgroupconfig = await Usergroupconfig.find({where:{groupid: groupid }, limit:1});
  return tmpgroupconfig[0];


}


async function GetUserconfig_Asowner(userid, usertype) {

  var tmpuserconfig = await Userconfig.find({where:{userid: userid, usertype: usertype }, limit:1}).populate("assignment");
	if(tmpuserconfig.length >=1) {
  	return tmpuserconfig[0];
	}
	else return null;

}

async function GetPersonalUserconfig_Asowner(personalid, usertype) {

  var tmpconfig = await Userpersonalconfig.find({where:{personalid: personalid }, limit:1}).populate("assignment");
	if(tmpconfig.length >=1) {
  return tmpconfig[0];
		  } else return null;


}





async function Getnodeto_Use(userid, usertype, nodetype) {
// Get nodes of type private or shared
// multiple users can share node with usergroup assignment
// Not belonging to usergroup can also share. But not implemented
// As it may complicate

// to add userslimit
  var nodeconfs = await Ipfsprovider.find({where: { 
	  nodetype: nodetype, usertype: usertype },limit: 1} );

  return nodeconfs;

	
}

async function CreateUserAssignment_C1(userid, usertype) {

 var buf = crypto.randomBytes(3);
 var rand = buf.toString('hex');
 var assignname = "agnid_"+userid+"_"+usertype+"_"+ rand;

 var  assrec = await Assignment.create({
        assignmentname : assignname,
        userid : userid,
        usergroupname : '',
        usertype : usertype,
        nodestatus : 'pending' ,
         } ).fetch();

   return assrec;
}



async function CreateUserAssignment_A1(userid, usertype) {
 var buf = crypto.randomBytes(3);
 var rand = buf.toString('hex');
 var assignname = "agnid_"+userid+"_"+usertype+"_"+ rand;

 var  assrec = await Assignment.create({
        assignmentname : assignname,
        userid : userid,
        usergroupname : '',
        usertype : usertype,
        nodestatus : 'pending' ,
         } ).fetch();

   return assrec;
}

async function CreateUserAssignment_A2(userid, usertype) {
 var buf = crypto.randomBytes(3);
 var rand = buf.toString('hex');
 var assignname = "agnid_"+userid+"_"+usertype+"_"+ rand;

 var  assrec = await Assignment.create({
        assignmentname : assignname,
        userid : userid,
        usertype : usertype,
        usergroupname : '',
        nodestatus : 'pending' ,
         } ).fetch();

   return assrec;
}

async function DeleteAssignment(userid, assign) {

 var  assrec = await Assignment.destroyOne({
        assignmentname : assign,
         } );

   return assrec;
}


async function DeleteUsergroupAssignment(groupid, assign) {

 var  assrec = await Assignment.destroyOne({
        assignmentname : assign,
         } );

   return assrec;
}

async function ReleaseNodeAssignment(nodeid, assign, assid) {

   var provrec = await Ipfsvirtualprovider.destroy({nodeid: nodeid,   assignmentname : assign  });

   if(assid) {
   //await Assignment.removeFromCollection(assid, 'nodeproviders', provrec.id);
	}

   return provrec;
}

async function  SetUsergroupTouser(userid, groupid) {
   var provrec = await User.update({ userid: userid}).set({ selectedgroupid : groupid }).fetch();
   return provrec;

};

async function  CreateGroupAssignment_A2(userg, usertype) {


  buf = crypto.randomBytes(3);
  rand = buf.toString('hex');
  var assignname = "agnid_"+userg.groupid+"_"+usertype+"_"+ rand;

  var  assrec = await Assignment.create({
        assignmentname : assignname,
        groupid : userg.groupid,
        usertype : usertype,
        usergroupname : userg.usergroupname,
        nodestatus : 'pending' ,
         } ).fetch();


   return assrec;
}

async function  CreateGroupAssignment_A1( userg, usertype) {


  buf = crypto.randomBytes(3);
  rand = buf.toString('hex');
  var assignname = "agnid_"+userg.groupid+"_"+usertype+"_"+ rand;

  var  assrec = await Assignment.create({
        assignmentname : assignname,
        groupid : userg.groupid,
        usertype : usertype,
        usergroupname : userg.usergroupname,
        nodestatus : 'pending' ,
         } ).fetch();

 
   return assrec;

}

