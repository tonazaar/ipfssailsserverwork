var _ = require('lodash');
crypto = require('crypto');

const IPFS = require('ipfs');
 const fs = require('fs')
 const path = require('path')

userdefault = require("./ipfsusage/userdefault.json");

module.exports = {
	//
// Don't add anything more to keep it generic
// assignnode
// assignnodegroup
// assignuser
// assignusergroup


assignuser : async function(req, res, next){

   if(!req.body.userid) {
    ResponseService.json(403, res, "userid not specified");
          return;
   }

   var userc = await Userconfig.findOne({email: user.email});
  if(userc) {
    ResponseService.json(403, res, "Config already exists ");
          return;
  }

   if(userc.assignmentname ) {
     if(req.body.overwrite == 'yes') {
	     // do nothing
     }else {
        ResponseService.json(403, res, "Assignment already exists ");
          return;

     }
  }


 var assrec ;
 if(req.body.usertype == 'C1') {
    assrec = await CreateUserAssignment_C1(req.body.userid, req.body.usertype);
 } else {
    ResponseService.json(403, res, "Only C1 usertype allowed" );
          return;

 }




/*
   var provrec = await Ipfsprovider.update({
               nodeid: req.body.nodeid}).set({
        assignmentname : assrec.assignmentname,
		   assignment: assrec.id,
               }).fetch();
*/
   var userconfigrec = await Useconfig.update({ 
	   id: userc.id}).set({ assignmentname : assrec.assignmentname,
		   assignment: assrec.id,
               }).fetch();

   res.json(userconfigrec);
},

assignusergroup : async function(req, res, next){

   if(!req.body.usergroup) {
    ResponseService.json(403, res, "usergroup not specified");
          return;
   }

   if(!req.body.nodeid) {
    ResponseService.json(403, res, "nodeid not specified");
          return;
   }


   var recs = await Assignment.findOne({userid: req.body.userid});
   if(recs) {
    ResponseService.json(403, res, "assignment already exists exist   ");
          return;

   }

   var buf = crypto.randomBytes(3);
  var rand = buf.toString('hex');
    var assignname = "agnid_"+req.body.userid+ rand;

   var assrec = await Assignment.create({
        assignmentname : assignname,
        nodeid : req.body.nodeid,
        usergroup : req.body.usergroup,
        nodename : req.body.nodename,
        nodegroup : req.body.nodegroup,
        nodestatus : 'pending' ,
         } ).fetch();



   var provrec = await Ipfsprovider.update({
               nodeid: req.body.nodeid}).set({
        assignmentname : assrec.assignmentname,
		   assignment: assrec.id,
               }).fetch();

   var usergrouprec = await Usergroup.update({ 
	   usergroup: req.body.usergroup}).set({ assignmentname : assrec.assignmentname,
		   assignment: assrec.id,
               }).fetch();

   res.json(usergrouprec);
},

assignnode : async function(req, res, next){


   if(!req.body.nodeid) {
    ResponseService.json(403, res, "nodeid not specified");
          return;
   }

   if(!req.body.assignmentname) {
    ResponseService.json(403, res, "assignmentname not specified");
          return;
   }

   var assrecs = await Assignment.findOne({assignmentname: req.body.assignmentname});
   if(!assrecs) {
        assrecs = await Assignment.create({
        assignmentname : req.body.assignmentname,
        nodeid : req.body.nodeid
               }).fetch();

   }

   var provrec = await Ipfsprovider.update({
               nodeid: req.body.nodeid}).set({
        assignmentname : req.body.assignmentname,
		   assignment: assrec.id,
               }).fetch();



   var assrec = await Assignment.update({
               id: assrecs.id}).set({
        nodename : provrec.nodename,
        nodeid : provrec.nodeid
               }).fetch();

   res.json(assrec);
},

assignnodegroup : async function(req, res, next){


   if(!req.body.nodegroup) {
    ResponseService.json(403, res, "nodegroup not specified");
          return;
   }

   if(!req.body.assignmentname) {
    ResponseService.json(403, res, "assignmentname not specified");
          return;
   }

   var assrecs = await Assignment.findOne({assignmentname: req.body.assignmentname});

   if(!assrecs) {
        assrecs = await Assignment.create({
        assignmentname : req.body.assignmentname,
        nodegroup : req.body.nodegroup
               }).fetch();

   }



   var provrec = await Ipfsprovider.update({
               nodegroup: req.body.nodegroup}).set({
        assignmentname : req.body.assignmentname,
		   assignment: assrec.id,
               }).fetch();




   res.json(provrec);
},

assignnodetogroup : async function(req, res, next){


   if(!req.body.nodeid) {
    ResponseService.json(403, res, "nodeid not specified");
          return;
   }

   if(!req.body.nodegroup) {
    ResponseService.json(403, res, "nodegroup not specified");
          return;
   }

   var nodegrp = await Ipfsprovider.findOne({nodegroup: req.body.nodegroup});

   if(!nodegrp) {
    ResponseService.json(403, res, "nodegrp does not exist   ");
          return;
   }

   if(!nodegrp.assignmentname) {
    ResponseService.json(403, res, "nodegrp.assignmentname does not exist   ");
          return;
   }


   var assrecs = await Assignment.findOne({assignmentname: nodegrp.assignmentname});
   if(!assrecs) {
    ResponseService.json(403, res, "assignment record does not exist   ");
          return;
   }

   var assrecs = await Assignment.findOne({assignmentname: req.body.assignmentname});

   var provrec = await Ipfsprovider.update({
               nodeid: req.body.nodeid}).set({
        assignmentname : nodegrp.assignmentname,
		   assignment: assrec.id,
               }).fetch();



   var assrec = await Assignment.update({
               id: assrecs.id}).set({
        nodename : provrec.nodename,
        nodeid : provrec.nodeid
               }).fetch();

   res.json(assrec);
},


updatenodestatus : async function(req, res, next){

   if(!req.body.nodeid) {
    ResponseService.json(403, res, "nodeid not specified");
          return;
   }

   if(!req.body.nodestatus) {
    ResponseService.json(403, res, "nodeid not specified");
          return;
   }


   var recs = await Ipfsprovider.findOne({nodeid: req.body.nodeid});
   if(!recs) {
    ResponseService.json(403, res, "Nodeid does not exist   ");
          return;

   }


   var newrec = await Ipfsprovider.update({
	       id: recs.id}).set({
        nodestatus : req.body.nodestatus,
               }).fetch();

   res.json(newrec);
},

joinnodecluster : async function(req, res, next){

var nodename = req.body.nodename; 
var nodegroup = req.body.nodegroup; 

   if(!req.body.nodename) {
    ResponseService.json(403, res, "Nodename not specified");
          return;
   }

   if(!req.body.nodegroup) {
    ResponseService.json(403, res, "Nodegroup not specified");
          return;
   }


   if(req.body.nodetype != 'clusternode') {

    ResponseService.json(403, res, "Nodetype is not cluster ");
          return;
   }



var jsonData;
   try {
    var fullpath =  path.resolve(__dirname, "./ipfsusage/"+nodegroup+"_"+nodename+".json");
    console.log(fullpath);
    jsonData = JSON.parse(fs.readFileSync(fullpath, 'utf-8'));
   } catch (err) {
    ResponseService.json(403, res, " Json file "+ nodegroup+"_"+nodename +".json not found" );
          return;
   }

   if(!jsonData.xconfig ) {

    ResponseService.json(403, res, "xconfig not specificed");
          return;
   }


  var recs = await Ipfsprovider.findOne({nodeid: jsonData.nodeid});
   if(recs) {
    ResponseService.json(403, res, "Nodeid already exists   ");
          return;

  }
 

  var newrec = await Ipfsprovider.create({
        nodeid : jsonData.nodeid,
        nodename : req.body.nodename,
        nodegroup : req.body.nodegroup,
        nodetype : req.body.nodetype,
        nodestatus : 'pending' ,
        nodelocation : 'remote' ,
        purpose : 'shared' ,
        useraccess : 'disabled'  ,
        usagelimit : jsonData.usagelimit,
	publicgateway: jsonData.publicgateway,
        localgateway: jsonData.localgateway,
        basepath: jsonData.basepath,
  	ipaddress : jsonData.ipaddress,
        xconfig : jsonData.xconfig,
         } ).fetch();

   res.json(newrec);
},

joinnodeprivate : async function(req, res, next){

   var nodename = req.body.nodename;
var nodegroup = req.body.nodegroup;

   if(!req.body.nodename) {
    ResponseService.json(403, res, "Nodename not specified");
          return;
   }

   if(!req.body.nodegroup) {
    ResponseService.json(403, res, "Nodegroup not specified");
          return;
   }


   if(req.body.nodetype != 'privatenode') {

    ResponseService.json(403, res, "Nodetype is not private ");
          return;
   }


var jsonData;
   try {
    var fullpath =  path.resolve(__dirname, "./ipfsusage/"+nodegroup+"_"+nodename+".json");
    console.log(fullpath);
    jsonData = JSON.parse(fs.readFileSync(fullpath, 'utf-8'));
   } catch (err) {
    ResponseService.json(403, res, " Json file "+ nodegroup+"_"+nodename +".json not found" );
          return;
   }

   if(!jsonData.xconfig ) {

    ResponseService.json(403, res, "xconfig not specificed");
          return;
   }


  var recs = await Ipfsprovider.findOne({nodeid: jsonData.nodeid});
   if(recs) {
       var newrec = await Ipfsprovider.update({
	       id: recs.id}).set({
        nodename : req.body.nodename,
        nodegroup : req.body.nodegroup,
        nodetype : req.body.nodetype,
        nodestatus : recs.nodestatus,
        nodelocation : recs.nodelocation ,
        useraccess : recs.useraccess, 
        usagelimit : jsonData.usagelimit,
        publicgateway: jsonData.publicgateway,
        localgateway: jsonData.localgateway,
        basepath: jsonData.basepath,
        ipaddress : jsonData.ipaddress,
        xconfig : jsonData.xconfig,
         } ).fetch();

   res.json(newrec);

  } else {

 

  var newrec = await Ipfsprovider.create({
        nodeid : jsonData.nodeid,
        nodename : req.body.nodename,
        nodegroup : req.body.nodegroup,
        nodetype : req.body.nodetype,
        nodestatus : 'pending' ,
        nodelocation : 'remote' ,
        purpose : 'shared' ,
        useraccess : 'disabled'  ,
        usagelimit : jsonData.usagelimit,
	publicgateway: jsonData.publicgateway,
        localgateway: jsonData.localgateway,
        basepath: jsonData.basepath,
  	ipaddress : jsonData.ipaddress,
        xconfig : jsonData.xconfig,
         } ).fetch();

   res.json(newrec);
    }
},

joinnodepublic : async function(req, res, next){

   var nodename = req.body.nodename;
var nodegroup = req.body.nodegroup;

   if(!req.body.nodename) {
    ResponseService.json(403, res, "Nodename not specified");
          return;
   }

   if(!req.body.nodegroup) {
    ResponseService.json(403, res, "Nodegroup not specified");
          return;
   }


   if(req.body.nodetype != 'publicnode') {

    ResponseService.json(403, res, "Nodetype is not public ");
          return;
   }

var jsonData;
   try {
    var fullpath =  path.resolve(__dirname, "./ipfsusage/"+nodegroup+"_"+nodename+".json");
    console.log(fullpath);
    jsonData = JSON.parse(fs.readFileSync(fullpath, 'utf-8'));
   } catch (err) {
    ResponseService.json(403, res, " Json file "+ nodegroup+"_"+nodename +".json not found" );
          return;
   }

   if(!jsonData.xconfig ) {

    ResponseService.json(403, res, "xconfig not specificed");
          return;
   }


  var recs = await Ipfsprovider.findOne({nodeid: jsonData.nodeid});
   if(recs) {

	   var newrec = await Ipfsprovider.update({
               id: recs.id}).set({
        nodename : req.body.nodename,
        nodegroup : req.body.nodegroup,
        nodetype : req.body.nodetype,
        nodestatus : recs.nodestatus,
        nodelocation : recs.nodelocation,
        useraccess : recs.useraccess,
        usagelimit : jsonData.usagelimit,
        publicgateway: jsonData.publicgateway,
        localgateway: jsonData.localgateway,
        basepath: jsonData.basepath,
        ipaddress : jsonData.ipaddress,
        xconfig : jsonData.xconfig,
         } ).fetch();

   res.json(newrec);


  } else {
 

  var newrec = await Ipfsprovider.create({
        nodeid : jsonData.nodeid,
        nodename : req.body.nodename,
        nodegroup : req.body.nodegroup,
        nodetype : req.body.nodetype,
        nodestatus : 'pending' ,
        nodelocation : 'remote' ,
        purpose : 'shared' ,
        useraccess : 'disabled'  ,
        usagelimit : jsonData.usagelimit,
	publicgateway: jsonData.publicgateway,
        localgateway: jsonData.localgateway,
        basepath: jsonData.basepath,
  	ipaddress : jsonData.ipaddress,
        xconfig : jsonData.xconfig,
         } ).fetch();

   res.json(newrec);
	   }
},


deletenodeid : async function(req, res, next){

var nodeid = req.body.nodeid; 

   if(!req.body.nodeid) {
    ResponseService.json(403, res, "Nodeid not specified");
          return;
   }


  var recs = await Ipfsprovider.findOne({nodeid: req.body.nodeid});
   if(!recs) {
    ResponseService.json(403, res, "Nodeid does not exist   ");
          return;

  }
 

  var delrec = await Ipfsprovider.destroyOne({
        nodeid : req.body.nodeid,
         } );

   res.json(delrec);
},

getnodedata : async function(req, res, next){

   if(!req.body.nodename ) {
    ResponseService.json(403, res, "Nodename is not set ");
          return;
   }

   if(!req.body.nodeid ) {
    ResponseService.json(403, res, "Nodeid is not set ");
          return;
   }

   if(!req.body.nodegroup ) {
    ResponseService.json(403, res, "Nodegroup is not set ");
          return;
   }


  var recs = await Ipfsprovider.findOne({nodename: req.body.nodename,
	   nodeid: req.body.nodeid,
	  nodegroup: req.body.nodegroup
      });
        res.json(recs);
},


getprivatenodes : async function(req, res, next){
	console.log ("In getprivatenodes");

   if(req.body.nodetype != 'privatenode') {

    ResponseService.json(403, res, "Nodetype is not private ");
          return;
   }

  var recs = await Ipfsprovider.find({nodetype: req.body.nodetype});
	res.json(recs);
},

listnodesofassignment : async function(req, res, next){

   if(!req.body.assignmentname ){

    ResponseService.json(403, res, "Assignmentname is not provided ");
          return;
   }

  var recs = await Ipfsprovider.find({ assignmentname: req.body.assignmentname });

  res.json(recs);

},

listassnodesbyuserid : async function(req, res, next){


   if(!req.body.userid ){

    ResponseService.json(403, res, "Userid is not provided ");
          return;
   }

  var userrec = await Userconfig.findOne({ userid: req.body.userid });

   if(!userrec ){
    ResponseService.json(403, res, "Userconfig not found");
          return;
   }


   if(!userrec.assignmentname || userrec.assignmentname == '' ){
    ResponseService.json(403, res, "No assignment to user ");
          return;
   }

  var recs = await Ipfsprovider.find({ assignmentname: userrec.assignmentname });

  res.json(recs);

},

listmynodesgroups : async function(req, res, next){


   if(!req.body.nodegroup ){

    ResponseService.json(403, res, "Nodegroup is not set ");
          return;
   }

  var recs = await Ipfsprovider.find({ nodegroup: req.body.nodegroup });

  res.json(recs);

},


getprivategroups : async function(req, res, next){

   if(req.body.nodetype != 'privatenode') {

    ResponseService.json(403, res, "Nodetype is not private ");
          return;
   }

  var db = Ipfsprovider.getDatastore().manager;

    // Now we can do anything we could do with a Mongo `db` instance:
    var collection = db.collection("ipfsprovider");

    collection.distinct("nodegroup", {nodetype: req.body.nodetype}).then(x=> {
		
        console.log (x);
        res.json(x);
    });

},


getpublicgroups : async function(req, res, next){

   if(req.body.nodetype != 'publicnode') {

    ResponseService.json(403, res, "Nodetype is not public ");
          return;
   }

  var db = Ipfsprovider.getDatastore().manager;

    // Now we can do anything we could do with a Mongo `db` instance:
    var collection = db.collection("ipfsprovider");

    collection.distinct("nodegroup", {nodetype: req.body.nodetype}).then(x=> {

        console.log (x);
        res.json(x);
    });

},


getpublicnodes : async function(req, res, next){
   if(req.body.nodetype != 'publicnode') {

    ResponseService.json(403, res, "Nodetype is not public ");
          return;
   }

  var recs = await Ipfsprovider.find({nodetype: req.body.nodetype});
        res.json(recs);

},

getclusternodes : async function(req, res, next){

   if(req.body.nodetype != 'clusternode') {

    ResponseService.json(403, res, "Nodetype is not cluster ");
          return;
   }

  var recs = await Ipfsprovider.find({nodetype: req.body.nodetype});
        res.json(recs);

},


	/*
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
*/

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

