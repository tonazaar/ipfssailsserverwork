
var Promise = require("bluebird");
var bcrypt = require("bcrypt")

var _ = require('lodash');

module.exports = {

  attributes: {
    creatoremail: {
      type: "string",
      required: true,
      unique: true,
    },
    creatorname: {
      type: "string",
      required: true,
    },
    creatoruserid: {
      type: "string",
      required: true,
    },
    usergroupkey: {
      type: "string",
    },
    providerupdatetime: {
      type: "string",
    },
     assignmentname: {
      type: "string",
    },

    usergroupname: {
      type: "string",
      required: true,
      unique: true,
    },
    usergrouptype: {
      type: "string",   //c1storage, a1private, a2public
    },
    nodegroup: {
      type: "string",
    },
    grouptokenassigned: {
      type: "string",
    },
    groupipfsconfig: {   // not sure
      type: "json",
    },
    grouptonwallet: {
      type: "json",
    },
    groupslpbalance: {
      type: "string",
    },
    grouptonbalance: {
      type: "string",
    },
    userconfigs: {
	    collection: 'Userconfig',
	    via: 'usergroupptr'
    },
     assignment: {
      model: 'Assignment',
    },

  },


};

