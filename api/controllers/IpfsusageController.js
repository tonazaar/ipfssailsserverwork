var _ = require('lodash');
const IPFS = require('ipfs');

userdefault = require("./ipfsusage/userdefault.json");

module.exports = {



getfile : async function(req, res, next){
    if(!req.body) {
    return ResponseService.json(401, res, "Data not provided  ")
    }
  var result = await Ipfsusage.findOne({
        hash : req.body.hash
	    });
	res.json(result);

},
checkpinning : async function(req, res, next){

},
getusage : async function(req, res, next){

},

listfiles : async function(req, res, next){
    if(!req.body) {
    return ResponseService.json(401, res, "Data not provided  ")
    }
  var recs = await Ipfsusage.find({userid: req.body.userid});

	res.json(recs);
},

listbasepaths : async function(req, res, next){
    if(!req.body) {
    return ResponseService.json(401, res, "Data not provided  ")
    }
  var recs = await Ipfsusage.find({userid: req.body.userid, path: req.body.path});

	res.json(recs);
},

checkbasepaths : async function(req, res, next){
    if(!req.body) {
    return ResponseService.json(401, res, "Data not provided  ")
    }

    if(!req.body.nodeid) {
    return ResponseService.json(401, res, "Node id not provided  ")
    }
 
  var recs = await Ipfsusage.find({userid: req.body.userid, path: req.body.path, nodeid: req.body.nodeid});

        res.json(recs);
},


createbasepath : async function(req, res, next){
    if(!req.body) {
    return ResponseService.json(401, res, "Data not provided  ")
    }

  var newrec = await Ipfsusage.create({
        path : req.body.path,
        name : req.body.name,
        hash : req.body.hash,
        cid : req.body.cid,
	nodetype: req.body.nodetype,
      nodeid: req.body.nodeid,
      nodegroup: req.body.nodegroup,
      nodename: req.body.nodename,
        userid: req.body.userid,
         } ).fetch();
	res.json(newrec);

},


savefile : async function(req, res, next){
    if(!req.body) {
    return ResponseService.json(401, res, "Data not provided  ")
    }
  var newrec = await Ipfsusage.create({
        path : req.body.path,
        name : req.body.name,
        hash : req.body.hash,
        cid : req.body.cid,
	nodetype: req.body.nodetype,
      nodeid: req.body.nodeid,
      nodegroup: req.body.nodegroup,
      nodename: req.body.nodename,
        userid: req.body.userid,
         } ).fetch();

	res.json(newrec);

},

searchfiles: async function (req, res) {

    var searchstring = req.body.searchstring;

    if(!req.body.userid) {
       return ResponseService.json(401, res, "Userid not provided  ")
    }

    console.log(searchstring);

    var db = Ipfsusage.getDatastore().manager;

    // Now we can do anything we could do with a Mongo `db` instance:
    var collection = db.collection("ipfsusage");

       collection.find({userid: req.body.userid },  {$or : [
                {'name': {$regex: searchstring }},
                {'cid': {$regex: searchstring }},
                {'nodename': {$regex: searchstring }},
                {'nodeid': {$regex: searchstring}}
             ] }, { projection: {'name':1, 'cid':1, 'nodeid':1, 'nodename':1}}

        ).toArray(function (err, results) {
	 console.log(JSON.stringify(results));
         if (err) return res.serverError(err);
         return res.ok(results);
       });


},


deletefile : async function(req, res, next){
    if(!req.body) {
    return ResponseService.json(401, res, "Data not provided  ")
    }
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


