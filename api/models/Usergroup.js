
var Promise = require("bluebird");
var bcrypt = require("bcrypt")

var _ = require('lodash');

module.exports = {

  attributes: {
    creatoremail: {
      type: "string",
      required: true,
    },
    creatorname: {
      type: "string",
      required: true,
    },
    groupid: {
      type: "string",
      required: true,
      unique: true,
    },
    creatoruserid: {
      type: "string",
      required: true,
    },
    usergroupkey: {
      type: "string",
    },
    providerupdatetime: {
      type: "string",
    },

    usergroupname: {
      type: "string",
      required: true,
    },
    usertype: {
      type: "string",   //c1storage, a1private, a2public
    },
    nodegroup: {
      type: "string",
    },
    grouptokenassigned: {
      type: "string",
    },
    grouptonwallet: {
      type: "json",
    },
    groupslpbalance: {
      type: "string",
    },
    grouptonbalance: {
      type: "string",
    },
    assignmentname: {
      type: "string",
    },
    userptr: {
      model: 'User',
    },
    usergroupconfig: {
        model: 'Usergroupconfig',
    },
    assignment: {
      model: 'Assignment',
    },

    usersptr: {
                  collection: 'User',
                  via : 'memberusergroup'
    },
     
     usergroupnodetags: {
      collection: 'Ipfsprovider',
      via: 'usergrouptags'
    } ,


  },


};

