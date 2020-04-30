var _ = require('lodash');
const IPFS = require('ipfs');
 const fs = require('fs')
 const path = require('path')

userdefault = require("./ipfsusage/userdefault.json");

module.exports = {

joinnodecluster : async function(req, res, next){

var nodeid = req.body.nodeid; 

   if(!req.body.nodeid) {
    ResponseService.json(403, res, "Nodeid not specified");
          return;
   }

   if(req.body.nodetype != 'clusternode') {

    ResponseService.json(403, res, "Nodetype is not cluster ");
          return;
   }

var jsonData;
   try {
    jsonData = JSON.parse(fs.readFileSync('./ipfsusage/"+nodeid+".json', 'utf-8'))
   } catch (err) {
    ResponseService.json(403, res, " Json file "+ nodeid +".json not found");
          return;
   }

   if(!jsonData.ipfsconfig ) {

    ResponseService.json(403, res, "ipfsconfig not specificed");
          return;
   }


  var recs = await Ipfsprovider.findOne({nodeid: req.body.nodeid});
   if(recs) {
    ResponseService.json(403, res, "Nodeid already exists   ");
          return;

  }
 

  var newrec = await Ipfsprovider.create({
        nodeid : req.body.nodeid,
        nodegroup : req.body.nodegroup,
        nodetype : req.body.nodetype,
        nodestatus : 'pending' ,
        nodelocation : 'remote' ,
        useraccess : 'disabled'  ,
        usagelimit : jsonData.usagelimit,
	publicgateway: jsonData.publicgateway,
        localgateway: jsonData.localgateway,
        basepath: jsonData.basepath,
  	ipaddress : jsonData.ipaddress,
        ipfsconfig : jsonData.ipfsconfig,
         } ).fetch();

   res.json(newrec);

},

joinnodeprivate : async function(req, res, next){

var nodeid = req.body.nodeid; 

   if(!req.body.nodeid) {
    ResponseService.json(403, res, "Nodeid not specified");
          return;
   }

   if(req.body.nodetype != 'privatenode') {

    ResponseService.json(403, res, "Nodetype is not private ");
          return;
   }

var jsonData;
   try {
    jsonData = JSON.parse(fs.readFileSync('./ipfsusage/"+nodeid+".json', 'utf-8'))
   } catch (err) {
    ResponseService.json(403, res, " Json file "+ nodeid +".json not found");
          return;
   }

   if(!jsonData.ipfsconfig ) {

    ResponseService.json(403, res, "ipfsconfig not specificed");
          return;
   }


  var recs = await Ipfsprovider.findOne({nodeid: req.body.nodeid});
   if(recs) {
    ResponseService.json(403, res, "Nodeid already exists   ");
          return;

  }
 

  var newrec = await Ipfsprovider.create({
        nodeid : req.body.nodeid,
        nodegroup : req.body.nodegroup,
        nodetype : req.body.nodetype,
        nodestatus : 'pending' ,
        nodelocation : 'remote' ,
        useraccess : 'disabled'  ,
        usagelimit : jsonData.usagelimit,
	publicgateway: jsonData.publicgateway,
        localgateway: jsonData.localgateway,
        basepath: jsonData.basepath,
  	ipaddress : jsonData.ipaddress,
        ipfsconfig : jsonData.ipfsconfig,
         } ).fetch();

   res.json(newrec);

},

joinnodepublic : async function(req, res, next){

var nodeid = req.body.nodeid; 

   if(!req.body.nodeid) {
    ResponseService.json(403, res, "Nodeid not specified");
          return;
   }

   if(req.body.nodetype != 'publicnode') {

    ResponseService.json(403, res, "Nodetype is not public ");
          return;
   }

var jsonData;
   try {
    var fullpath =  path.resolve(__dirname, "./ipfsusage/"+nodeid+".json");
    console.log(fullpath);
    jsonData = JSON.parse(fs.readFileSync(fullpath, 'utf-8'));
   } catch (err) {
    ResponseService.json(403, res, " Json file "+ nodeid +".json not found" );
          return;
   }

   if(!jsonData.xconfig ) {

    ResponseService.json(403, res, "xconfig not specificed");
          return;
   }


  var recs = await Ipfsprovider.findOne({nodeid: req.body.nodeid});
   if(recs) {
    ResponseService.json(403, res, "Nodeid already exists   ");
          return;

  }
 

  var newrec = await Ipfsprovider.create({
        nodeid : req.body.nodeid,
        nodename : req.body.nodeid,
        nodegroup : req.body.nodegroup,
        nodetype : req.body.nodetype,
        nodestatus : 'pending' ,
        nodelocation : 'remote' ,
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
        nodename : req.body.nodeid,
         } );

   res.json(delrec);
},


getprivatenodes : async function(req, res, next){

   if(req.body.nodetype != 'privatenode') {

    ResponseService.json(403, res, "Nodetype is not private ");
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


