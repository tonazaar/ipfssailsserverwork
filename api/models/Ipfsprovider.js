
var Promise = require("bluebird");
var bcrypt = require("bcrypt")

var _ = require('lodash');

module.exports = {

  attributes: {
    nodelocation: {
      type: "string",
    },
    nodegroup: {
      type: "string",
    },
    nodeid: {
      type: "string",
      required: true,
    },
    purpose: {
      type: "string",
    },
    assignmentname: {
      type: "string",
    },
    nodename: {
      type: "string",
      required: true,
    },
    usagelimit: {
      type: "string",
    },
    useraccess: {
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
    xconfig: {
      type: "json",
    },
    gconfig: {
      type: "json",
    },
    publicgateway: {
      type: "string",
    },
    localgateway: {
      type: "string",
    },
    ipaddress: {
      type: "string",
    },
    basepath: {
      type: "string",
    },
    assignment: {
      model: 'Assignment',
    },


  },


};

