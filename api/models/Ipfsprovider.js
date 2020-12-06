
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
    nodename: {
      type: "string",
      required: true,
    },
    usagelimit: {
      type: "string",
    },
    userslimit: {
      type: "string",
    },
    settinglimit: {
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
    userpersonaltags: {
      collection: 'user',
      via: 'userpersonalnodetags'
    } ,
 
    usertags: {
      collection: 'user',
      via: 'usernodetags'
    } ,
    usergrouptags: {
      collection: 'usergroup',
      via: 'usergroupnodetags'
    }

  },


};

