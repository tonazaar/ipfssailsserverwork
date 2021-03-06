
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
    tokenid: {
      type: "string",
      required: true,
    },
    wallettype: {
      type: "string",
      required: true,
    },
    slpderivepath: {
      type: "string",
       unique: true,
      required: true,
    },
    slpwallet: {
      type: "json",
    },
    tonwallet: {
      type: "json",
    },
     slpbalance: {
      type: "string", 
	     defaultsTo: "0.0"
    },
    tonbalance: {
      type: "string",
	     defaultsTo: "0.0"
    },


  },


};

