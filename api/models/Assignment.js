
var Promise = require("bluebird");
var bcrypt = require("bcrypt")

var _ = require('lodash');

module.exports = {

  attributes: {
    nodegroup: {
      type: "string",
    },
    nodeid: {
      type: "string",
    },
    username: {
      type: "string",
    },
    usergroupname: {
      type: "string",
    },
    assignmentname: {
      type: "string",
    },
    nodename: {
      type: "string",
    },
    userid: {
      type: "string",
    },
    groupid: {
      type: "string",
    },
    usertype: {
      type: "string",
    },
    nodetype: {
      type: "string",
    },
    nodestatus: {
      type: "string",
    },
    nodeusage: {
      type: "string",  // dedicated or shared
    },

  },


};

