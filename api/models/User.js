
var Promise = require("bluebird");
var bcrypt = require("bcrypt")

var _ = require('lodash');

module.exports = {

  attributes: {
    email: {
      type: "string",
      required: true,
      unique: true,
    },
    username: {
      type: "string",
      required: true,
    },
    userid: {
      type: "string",
      required: true,
    },
    selectedgroupida1: {
      type: "string",
    },
    selectedgroupida2: {
      type: "string",
    },
    selectedgroupidc1: {
      type: "string",
    },
    usera1nodetags: {
      collection: 'Ipfsprovider',
      via: 'usera1tags'
    } ,
    usera2nodetags: {
      collection: 'Ipfsprovider',
      via: 'usera2tags'
    } ,
    userc1nodetags: {
      collection: 'Ipfsprovider',
      via: 'userc1tags'
    } ,
    userpersonalnodetags: {
      collection: 'Ipfsprovider',
      via: 'userpersonaltags'
    } ,


	  usergroup: {
		  collection: 'Usergroup',
		  via : 'userptr'
	  },
	  userconfig: {
		  collection: 'Userconfig',
		  via : 'userptr'
	  },
	  memberusergroup: {
		  collection: 'Usergroup',
		  via : 'usersptr'
	  },
    userpersonalconfig: {
	   model: 'Userpersonalconfig',
    },
    
    role: {
      type: "string",
      required: true,
    },
    account: {
    type: 'number',
    unique: true,
    },
    password: {
      type: "string",
      required: true,
      columnName: "encryptedPassword"
    },

  },

  beforeCreate: function(values, cb){
    bcrypt.hash(values.password, 10, function (err, hash) {
      if (err) return cb(err);
      values.password = hash;
      cb();
    });
  },

  comparePassword: function (password, user) {

    return new Promise(function (resolve, reject) {
      bcrypt.compare(password, user.password, function (err, match) {
        if (err) reject(err);

        if (match) {
          resolve(true);
        } else {
          reject(err);
        }
      })
    });
  }

};

