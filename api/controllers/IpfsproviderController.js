var _ = require('lodash');
const IPFS = require('ipfs');
 const fs = require('fs')
 const path = require('path')

userdefault = require("./ipfsusage/userdefault.json");

module.exports = {
	//
// may be not needed
assignpurpose : async function(req, res, next){

   if(!req.body.nodeid) {
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
        purpose : req.body.purpose,
               }).fetch();

   res.json(newrec);
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

joinnodepersonal : async function(req, res, next){

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


   if(req.body.nodetype != 'personalnode') {

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

getallnodes : async function(req, res, next){
        console.log ("In getprivatenodes");


  var recs = await Ipfsprovider.find({});
        res.json(recs);
},

getallvirtualnodes : async function(req, res, next){
        console.log ("In getprivatenodes");


  var recs = await Ipfsvirtualprovider.find({});
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

listnodesofgroup : async function(req, res, next){


   if(!req.body.nodegroup ){

    ResponseService.json(403, res, "Nodegroup is not set ");
          return;
   }
   if(!req.body.nodetype ){

    ResponseService.json(403, res, "Nodetype is not set ");
          return;
   }

  var recs = await Ipfsprovider.find({ nodegroup: req.body.nodegroup, nodetype: req.body.nodetype });

  res.json(recs);

},

listusersofnode : async function(req, res, next){


   if(!req.body.nodeid ){

    ResponseService.json(403, res, "Nodeid is not set ");
          return;
   }

  var recs = await Ipfsprovider.find({ nodeid: req.body.nodeid  }).populate('usertags');

  res.json(recs[0]);

},

listnodesofuser : async function(req, res, next){


   if(!req.body.userid ){

    ResponseService.json(403, res, "Userid is not set ");
          return;
   }
   if(!req.body.usertype ){

    ResponseService.json(403, res, "usertype is not set ");
          return;
   }

   var usertype = req.body.usertype ;

//  var recs = await User.findOne({ userid: req.body.userid  }).populate('usernodetags',
//	{where : { usertype: req.body.usertype} });

//  res.json(recs.usernodetags);

//  var recs ;

 var xx;

 if(usertype == 'A1') {
         xx = 'usera1nodetags';
 }else if( usertype == 'A2') {
         xx = 'usera2nodetags';
 }
 else if( usertype == 'C1') {
         xx = 'userc1nodetags';
 }

 var recs = await User.findOne({ userid: req.body.userid  }).populate( xx);

 if(usertype == 'A1') {
          res.json( recs.usera1nodetags); 
 }else if( usertype == 'A2') {
          res.json( recs.usera2nodetags); 
 }
 else if( usertype == 'C1') {
          res.json( recs.userc1nodetags); 
 }
 



},

listnodesofusergroup : async function(req, res, next){


   if(!req.body.userid ){

    ResponseService.json(403, res, "Userid is not set ");
          return;
   }
   if(!req.body.usertype ){

    ResponseService.json(403, res, "usertype is not set ");
          return;
   }


  var recs = await User.findOne({ userid: req.body.userid  }).populate('usergroupnodetags',
	{where : { usertype: req.body.usertype}} );

  res.json(recs.usergroupnodetags);

},

listnodesofuserpersonal : async function(req, res, next){


   if(!req.body.userid ){

    ResponseService.json(403, res, "Userid is not set ");
          return;
   }
   if(!req.body.usertype ){

    ResponseService.json(403, res, "usertype is not set ");
          return;
   }


  var recs = await User.findOne({ userid: req.body.userid  }).populate('userpersonalnodetags',
	{where : { usertype: req.body.usertype}} );

  res.json(recs.userpersonalnodetags);

},

listgroupsofnode : async function(req, res, next){


   if(!req.body.nodeid ){

    ResponseService.json(403, res, "Nodeid is not set ");
          return;
   }

  var recs = await Ipfsprovider.find({ nodeid: req.body.nodeid  }).populate('grouptags');

  res.json(recs[0]);

},

listmynodes : async function(req, res, next){


   if(!req.body.userid ){

    ResponseService.json(403, res, "Userid is not set ");
          return;
   }

  var recs = await Ipfsprovider.find({ userid: req.body.userid });

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

getpersonalnodes : async function(req, res, next){

   if(req.body.nodetype != 'personalnode') {

    ResponseService.json(403, res, "Nodetype is not public ");
          return;
   }

  var recs = await Ipfsprovider.find({nodetype: req.body.nodetype});
	res.json(recs);


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


