
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
  assignmentname: {
      type: "string",
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
    nodeid: {
      type: "string",
    },
    nodegroup: {
      type: "string",
    },
    providerupdatetime: {
      type: "string",
    },
    nodeupdatetime: {
      type: "string",
    },
    usergroupupdatetime: {
      type: "string",
    },
    ipfsconfigupdatetime : {
      type: "string",
    },
    usergroupname: {
      type: "string",
    },
    usergroupptr: {
      model: 'Usergroup',
    },
    userptr: {
      model: 'User',
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

