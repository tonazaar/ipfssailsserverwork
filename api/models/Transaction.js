
var Promise = require("bluebird");
var bcrypt = require("bcrypt")

var _ = require('lodash');

module.exports = {

  attributes: {
    userid: {
      type: "string",
      required: true,
    },
    tokenid: {
      type: "string",
      required: true,
    },
    status: {
      type: "string", // started, ended
      required: true,
    },
    outcome: {
      type: "string", // success, error
    },
    transactionid: {
      type: "string",
    },
    startinfo: {
      type: "json",
    },
    endinfo: {
      type: "json",
    },

  },

};

