
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
    usagelimit: {
      type: "string",
    },
    useraccess: {
      type: "string",
    },
    nodetype: {
      type: "string",
    },
    usergroupname: {
      type: "string",
    },
    usergrouptype: {
      type: "string",
    },
    tokenassigned: {
      type: "string",
    },
    useripfsconfig: {
      type: "json",
    },
    tonwallet: {
      type: "json",
    },
    slpbalance: {
      type: "string",
    },
    tonbalance: {
      type: "string",
    },

  },


};

