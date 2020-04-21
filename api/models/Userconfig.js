
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
    nodetype: {
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

  },


};

