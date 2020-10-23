
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
    usergroupname: {
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
    usertype: {
      type: "string",  // c1single, a2group, a1group. Currently used as C1, A1, A2 
       // Used to control from frontend
    },
    usergrouptype: {
      type: "string",  // c1storage etc
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
     assignment: {
      model: 'Assignment',
    },

  },




};

