
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
    usergroup: {
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

