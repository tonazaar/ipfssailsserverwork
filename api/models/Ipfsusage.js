
var Promise = require("bluebird");
var bcrypt = require("bcrypt")

var _ = require('lodash');

module.exports = {

  attributes: {
    userid: {
      type: "string",
    },
    hash: {
      type: "string",
    },
    path: {
      type: "string",
    },
    cid: {
      type: "string",
    },
    activity: {
      type: "string",
    },
    name: {
      type: "string",
    },
    nodegroup: {
      type: "string",
      required: true,
    },
    nodeid: {
      type: "string",
      required: true,
    },
    nodename: {
      type: "string",
      required: true,
    },


  },


};

