
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
    usertype: {
      type: "string",   //c1storage, a1private, a2public
    },
    nodegroup: {
      type: "string",
    },
    grouptokenassigned: {
      type: "string",
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
    userptr: {
      model: 'User',
    },
    usergroupconfig: {
      model: 'Usergroupconfig',
    },

     assignment: {
      model: 'Assignment',
    },

  },


};

