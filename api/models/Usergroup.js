
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
    usergrouptype: {
      type: "string",   //c1storage, a1private, a2public
    },
    nodegroup: {
      type: "string",
    },
    grouptokenassigned: {
      type: "string",
    },
    oneipfsconfig: {
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

  },


};

