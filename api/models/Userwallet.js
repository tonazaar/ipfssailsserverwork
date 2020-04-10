
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
    wallettype: {
      type: "string",
      required: true,
    },
    slpwallet: {
      type: "string",
      required: true,
    },
    tonwallet: {
      type: "string",
      required: true,
    },


  },


};

