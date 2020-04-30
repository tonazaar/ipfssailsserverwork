
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
      unique: true,
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
    nodetype: {
      type: "string",
    },
    nodestatus: {
      type: "string",
    },
    xconfig: {
      type: "json",
    },
    publicgateway: {
      type: "string",
    },
    privategateway: {
      type: "string",
    },
    ipaddress: {
      type: "string",
    },
    basepath: {
      type: "string",
    },

  },


};

